import { UserInfo } from "./user_info.ts";
import { TrophyList } from "./trophy_list.ts";
import { Trophy } from "./trophy.ts";
import { Theme } from "./theme.ts";

export class Card {
  private width = 0;
  private height = 0;
  constructor(
    private titles: Array<string>,
    private ranks: Array<string>,
    private maxColumn: number,
    private maxRow: number,
    private panelSize: number,
    private marginWidth: number,
    private marginHeight: number,
    private noBackground: boolean,
    private noFrame: boolean,
  ) {
    this.width = panelSize * this.maxColumn +
      this.marginWidth * (this.maxColumn - 1);
  }
  render(
    userInfo: UserInfo,
    organizationStargazers: number,
    theme: Theme,
  ): string {
    const trophyList = new TrophyList(userInfo, organizationStargazers);

    trophyList.filterByHideen();

    if (this.titles.length != 0) {
      trophyList.filterByTitles(this.titles);
    }

    if (this.ranks.length != 0) {
      trophyList.filterByRanks(this.ranks);
    }

    trophyList.sortByRank();

    const row = this.getRow(trophyList);
    this.height = this.getHeight(row);

    return `
    <svg
      width="${this.width}"
      height="${this.height}"
      viewBox="0 0 ${this.width} ${this.height}"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      ${this.renderTrophy(trophyList, theme)}
    </svg>`;
  }
  private getRow(trophyList: TrophyList) {
    let row = Math.floor((trophyList.length - 1) / this.maxColumn) + 1;
    if (row > this.maxRow) {
      row = this.maxRow;
    }
    return row;
  }
  private getHeight(row: number) {
    // Calculate the height of card from turns
    return this.panelSize * row + this.marginHeight * (row - 1);
  }

  private renderTrophy(trophyList: TrophyList, theme: Theme) {
    return trophyList.getArray.reduce(
      (sum: string, trophy: Trophy, i: number) => {
        const currentColumn = i % this.maxColumn;
        const currentRow = Math.floor(i / this.maxColumn);
        const x = this.panelSize * currentColumn +
          this.marginWidth * currentColumn;
        const y = this.panelSize * currentRow + this.marginHeight * currentRow;
        return sum +
          trophy.render(
            theme,
            x,
            y,
            this.panelSize,
            this.noBackground,
            this.noFrame,
          );
      },
      "",
    );
  }
}
