namespace Shedule.Domain.Enums
{
    public enum StatusCode
    {
        Ok,
        ServerError,

        UnAuthorization,
        LoginIsUlredyRegistered,

        InvalidToken,
        NotFoundUser,
        NotEnoughRight,

        InvalidData,

        ExcelFileExist,
        NotFoundExcelFile
        

    }
}
