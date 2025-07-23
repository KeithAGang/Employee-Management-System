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

    public record UpdateSalesDto(
        Guid SalesRecordId,
        string CustomerName,
        string ProductName,
        string? Notes
    );
}