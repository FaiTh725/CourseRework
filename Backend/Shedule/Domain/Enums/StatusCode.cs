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
        NotFountProfile,
        NotEnoughRight,

        InvalidData,
        InvalidEmail,

        ExcelFileExist,
        NotFoundExcelFile
        

    }
}
