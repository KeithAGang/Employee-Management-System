namespace backend.Dtos
{
    public record GetSalesDto(
        Guid SalesRecordId,
        string CustomerName,
        DateTime SaleDate,
        int Quantity,
        decimal UnitPrice,
        decimal TotalAmount,
        string? Notes
    );
}