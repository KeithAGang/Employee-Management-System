namespace backend.Dtos
{
    public record CreateSalesDto(
        string CustomerName,
        string ProductName,
        int Quantity,
        decimal UnitPrice,
        decimal Amount,
        DateTime SaleDate,
        string? Notes
    );
}