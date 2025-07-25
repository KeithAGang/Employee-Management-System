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

    public record GetSalesDtoEx(
        Guid SalesRecordId,
        string CustomerName,
        string SubordinateName,
        DateTime SaleDate,
        int Quantity,
        decimal UnitPrice,
        decimal TotalAmount,
        string? Notes
    );
}