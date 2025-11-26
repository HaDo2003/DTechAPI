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

            const int maxRetries = 5;

            for (int attempt = 0; attempt < maxRetries; attempt++)
            {
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
                catch (DbUpdateException ex)
                {
                    // Catch concurrency and constraint violations
                    var errorMessage = ex.InnerException?.Message ?? ex.Message;
                    var shouldRetry = errorMessage.Contains("could not serialize") ||
                                     errorMessage.Contains("concurrent update") ||
                                     errorMessage.Contains("duplicate key") ||
                                     errorMessage.Contains("unique constraint");

                    if (!shouldRetry || attempt == maxRetries - 1)
                    {
                        Console.WriteLine($"Error updating visitor count: {errorMessage}");
                        return new IndexResDto<object?>
                        {
                            Success = false,
                            Message = "Failed to update visitor count"
                        };
                    }

                    // Exponential backoff: 50ms, 100ms, 200ms, 400ms
                    await Task.Delay(TimeSpan.FromMilliseconds(50 * Math.Pow(2, attempt)));
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

            return new IndexResDto<object?>
            {
                Success = false,
                Message = "Failed to update visitor count"
            };
        }
    }
}
