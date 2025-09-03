using AutoMapper;
using DTech.Application.DTOs.request;
using DTech.Application.DTOs.response;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Interfaces;

namespace DTech.Application.Services
{
    public class CustomerService(
        ICustomerRepository customerRepo,
        IMapper mapper,
        ICloudinaryService cloudinaryService
    ) : ICustomerService
    {
        readonly string folderName = "Pre-thesis/Customer";
        public async Task<CustomerDto> GetCustomer(string customerId)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new CustomerDto { Success = false, Message = "Customer not found" };

            var customerDto = mapper.Map<CustomerDto>(customer);
            return customerDto;
        }

        public async Task<MessageResponse> UpdateCustomerProfile(string customerId, UpdateProfileDto model)
        {
            var customer = await customerRepo.GetCustomerByIdAsync(customerId);
            if (customer == null)
                return new MessageResponse { Success = false, Message = "Customer not found" };

            // Check email existed
            var existingEmail = await customerRepo.CheckEmailAsync(model.Email, customer.Id);
            if (existingEmail)
                return new MessageResponse { Success = false, Message = "Email already exists." };


            // Check phone existed
            var existingPhone = await customerRepo.CheckPhoneAsync(model.PhoneNumber, customer.Id);
            if (existingPhone)
                return new MessageResponse { Success = false, Message = "Phone number already exists." };


            // Handle image change
            if (model.ImageUpload != null && model.ImageUpload.Length > 0)
            {
                string imageName = await cloudinaryService.ChangeImageAsync(
                    oldfile: customer.Image ?? string.Empty,
                    newfile: model.ImageUpload,
                    filepath: folderName
                );

                if (string.IsNullOrEmpty(imageName))
                {
                    return new MessageResponse { Success = false, Message = "Image upload failed" };
                }

                model.Image = imageName;
            }

            var newProfile = mapper.Map<ApplicationUser>(model);
            newProfile.Id = customerId;

            var isUpdated = await customerRepo.UpdateCustomerAsync(newProfile);
            if (!isUpdated)
                return new MessageResponse { Success = false, Message = "Failed to update profile" };
            
            return new MessageResponse { Success = true, Message = "Profile updated successfully" };
        }
    }
}
