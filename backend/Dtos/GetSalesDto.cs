namespace backend.Dtos
{
    public record GetSalesDto(
        string CustomerName,
        DateTime SaleDate,
        int Quantity,
        decimal UnitPrice,
        decimal TotalAmount,
        string? Notes
    );
}