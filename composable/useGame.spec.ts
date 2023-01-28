import { describe, it, expect } from "vitest";
import { useGame, Direction } from "./useGame";
import { BLOCKS } from "./blocks";

const getFieldStr = (field: number[][]) => {
  return field
    .map((line, i) => line.map((n) => (n ? n : " ")).join("") + i)
    .join("\n");
};

describe("useGame", () => {
  it("フィールドの配列を取得できること", () => {
    const genRandomNum = () => 0;
    const { field } = useGame({ genRandomNum });
    expect(field.value).toHaveLength(22);
    expect(field.value[0]).toHaveLength(12);
  });

  it("ゲーム開始前は moveBlock しても変化がないこと", () => {
    const genRandomNum = () => 0;
    const getRandomDir = (): Direction => {
      const dirs: Direction[] = ["left", "right", "down", "rotate"];
      return dirs[~~(Math.random() * dirs.length)];
    };
    const { field, moveBlock } = useGame({ genRandomNum });
    const fieldBefore = getFieldStr(field.value);
    for (let i = 0; i < 100; i++) {
      const dir = getRandomDir();
      moveBlock(dir);
    }
    const fieldAfter = getFieldStr(field.value);
    expect(fieldAfter).toBe(fieldBefore);
  });

  describe("ブロックの操作", () => {
    const genRandomNum = () => 0;

    it.each(["left", "right"])(
      "%s に移動できて、壁は突き抜けないこと",
      (dir) => {
        const { field, moveBlock, gameStart } = useGame({ genRandomNum });
        gameStart();
        for (var i = 1; i <= 5; i++) {
          moveBlock(dir as Direction);
          if (i > 2) {
            expect(getFieldStr(field.value)).toMatchSnapshot();
          }
        }
      }
    );

    it("下に移動できて、一番下まで行ったら次のブロックが追加されること", () => {
      const { field, moveBlock, gameStart } = useGame({ genRandomNum });
      gameStart();
      for (var i = 1; i <= 18; i++) {
        moveBlock("down");
        if (i > 15) {
          expect(getFieldStr(field.value)).toMatchSnapshot();
        }
      }
    });

    it("回転できること", () => {
      const genRandomNum = () => (1 / BLOCKS.length) * 4;
      const { field, moveBlock, gameStart } = useGame({ genRandomNum });
      gameStart();
      for (var i = 1; i <= 5; i++) {
        moveBlock("rotate");
        expect(getFieldStr(field.value)).toMatchSnapshot();
      }
    });
  });

  it("新しいブロックが置けないと終了すること", () => {
    const genRandomNum = () => 0;
    const { tick, field, gameStart, gameStatus } = useGame({
      genRandomNum,
    });
    expect(gameStatus.value).toBe("cover");
    gameStart();
    expect(gameStatus.value).toBe("playing");
    for (var i = 1; i <= 100; i++) {
      tick();
    }
    expect(getFieldStr(field.value)).toMatchSnapshot();
    expect(gameStatus.value).toBe("end");
  });
});
