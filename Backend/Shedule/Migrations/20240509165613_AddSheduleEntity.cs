using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shedule.Migrations
{
    /// <inheritdoc />
    public partial class AddSheduleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SheduleGroups",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Group = table.Column<int>(type: "INTEGER", nullable: false),
                    DayOfWeek = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SheduleGroups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SheduleDayOfWeeks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DayOfWeek = table.Column<int>(type: "INTEGER", nullable: false),
                    IdSheduleGroup = table.Column<int>(type: "INTEGER", nullable: false),
                    SheduleGroupId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SheduleDayOfWeeks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SheduleDayOfWeeks_SheduleGroups_SheduleGroupId",
                        column: x => x.SheduleGroupId,
                        principalTable: "SheduleGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Teacher = table.Column<string>(type: "TEXT", nullable: false),
                    Time = table.Column<string>(type: "TEXT", nullable: false),
                    SheduleDayOfWeekId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subjects_SheduleDayOfWeeks_SheduleDayOfWeekId",
                        column: x => x.SheduleDayOfWeekId,
                        principalTable: "SheduleDayOfWeeks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SheduleDayOfWeeks_SheduleGroupId",
                table: "SheduleDayOfWeeks",
                column: "SheduleGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_Subjects_SheduleDayOfWeekId",
                table: "Subjects",
                column: "SheduleDayOfWeekId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropTable(
                name: "SheduleDayOfWeeks");

            migrationBuilder.DropTable(
                name: "SheduleGroups");
        }
    }
}
