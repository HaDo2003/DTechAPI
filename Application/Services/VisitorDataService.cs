using DTech.Application.DTOs.Response.Admin;
using DTech.Application.Interfaces;
using DTech.Domain.Entities;
using DTech.Domain.Enums;
using DTech.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DTech.Application.Services
{
    public class VisitorDataService(IVisitorDataRepository dataRepo) : IVisitorDataService
    {
        public async Task<IndexResDto<object?>> UpdateVisitorCountAsync()
        {
            var today = DateOnly.FromDateTime(DateTime.Now);
            var weekOfYear = System.Globalization.CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(
                DateTime.Now,
                System.Globalization.CalendarWeekRule.FirstDay,
                DayOfWeek.Monday
            );

            var customDay = DateTime.Now.DayOfWeek switch
            {
                DayOfWeek.Monday => DayOfWeekEnums.Monday,
                DayOfWeek.Tuesday => DayOfWeekEnums.Tuesday,
                DayOfWeek.Wednesday => DayOfWeekEnums.Wednesday,
                DayOfWeek.Thursday => DayOfWeekEnums.Thursday,
                DayOfWeek.Friday => DayOfWeekEnums.Friday,
                DayOfWeek.Saturday => DayOfWeekEnums.Saturday,
                DayOfWeek.Sunday => DayOfWeekEnums.Sunday,
                _ => DayOfWeekEnums.Monday
            };

            try
            {
                await dataRepo.ExecuteInTransactionAsync(async () =>
                {
                    var existing = await dataRepo.GetVisitorCountByDateAsync(today);

                    if (existing != null)
                    {
                        // Update existing record
                        existing.Count += 1;
                        await dataRepo.UpdateVisitorCountAsync(existing);
                    }
                    else
                    {
                        // Create new record
                        var newVisitorCount = new VisitorCount
                        {
                            Date = today,
                            Day = customDay,
                            Week = weekOfYear,
                            Count = 1
                        };
                        await dataRepo.CreateVisitorCountAsync(newVisitorCount);
                    }

                    return true;
                });

                return new IndexResDto<object?>
                {
                    Success = true,
                    Message = "Visitor count updated successfully"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating visitor count: {ex.Message}");
                return new IndexResDto<object?>
                {
                    Success = false,
                    Message = "Failed to update visitor count"
                };
            }
        }
    }
}
