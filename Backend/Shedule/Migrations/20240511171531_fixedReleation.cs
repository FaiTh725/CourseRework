using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Shedule.Migrations
{
    /// <inheritdoc />
    public partial class fixedReleation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProfileEntitySheduleGroup",
                columns: table => new
                {
                    FolovingGroupId = table.Column<int>(type: "INTEGER", nullable: false),
                    ProfilesId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProfileEntitySheduleGroup", x => new { x.FolovingGroupId, x.ProfilesId });
                    table.ForeignKey(
                        name: "FK_ProfileEntitySheduleGroup_Profiles_ProfilesId",
                        column: x => x.ProfilesId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProfileEntitySheduleGroup_SheduleGroups_FolovingGroupId",
                        column: x => x.FolovingGroupId,
                        principalTable: "SheduleGroups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProfileEntitySheduleGroup_ProfilesId",
                table: "ProfileEntitySheduleGroup",
                column: "ProfilesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProfileEntitySheduleGroup");
        }
    }
}
