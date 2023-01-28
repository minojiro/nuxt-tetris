import { ref, computed } from "vue";
import { BLOCKS } from "./blocks";

export type Field = number[][];

export type Direction = "rotate" | "down" | "left" | "right";

export type GameStatus = "cover" | "playing" | "end";

type Position = [x: number, y: number];

const KEY_MOVE_MAP: Record<Direction, Position> = {
  rotate: [0, 0],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const FIELD_WIDTH = 12;
const FIELD_HEIGHT = 22;

const getEmptyField = (withWall = false): Field => {
  return Array.from({ length: FIELD_HEIGHT }, (_, i) =>
    Array.from({ length: FIELD_WIDTH }, (_, j) => {
      return withWall &&
        (i === FIELD_HEIGHT - 1 || j === 0 || j === FIELD_WIDTH - 1)
        ? 1
        : 0;
    })
  );
};

export const useGame = ({ genRandomNum }: { genRandomNum: () => number }) => {
  const gameStatus = ref<GameStatus>("cover");

  const fixedField = ref(getEmptyField(true));
  const currentBlockPosition = ref<Position>([0, 0]);
  const currentBlockId = ref<number>(0);
  const currentBlockRotate = ref<number>(0);

  const fieldAndConflict = computed(() => {
    let conflict = false;
    if (gameStatus.value !== "playing") {
      const isCover = gameStatus.value === "cover";
      const field = isCover ? getEmptyField(true) : fixedField.value;
      return {
        field,
        conflict,
      };
    }
    const [blockX, blockY] = currentBlockPosition.value;
    const block =
      BLOCKS[currentBlockId.value][
        currentBlockRotate.value % BLOCKS[currentBlockId.value].length
      ];
    const field = fixedField.value.map((line, y) =>
      line.map((fixedFieldCell, x) => {
        const blockCell = block[y - blockY]?.[x - blockX] || 0;
        conflict = conflict || !!(blockCell && fixedFieldCell);
        return blockCell + fixedFieldCell;
      })
    );
    return { field, conflict };
  });

  const field = computed(() => fieldAndConflict.value.field);
  const conflict = computed(() => fieldAndConflict.value.conflict);

  const setNextBlock = () => {
    currentBlockPosition.value = [4, 1];
    currentBlockId.value = Math.floor(genRandomNum() * BLOCKS.length);
    currentBlockRotate.value = 0;

    if (conflict.value) {
      gameStatus.value = "end";
    }
  };

  const moveBlock = (direction: Direction) => {
    if (gameStatus.value !== "playing") return;
    const [movX, movY] = KEY_MOVE_MAP[direction];
    const [curX, curY] = currentBlockPosition.value;
    currentBlockPosition.value = [curX + movX, curY + movY];
    if (direction === "rotate") {
      currentBlockRotate.value++;
    }

    if (conflict.value) {
      currentBlockPosition.value = [curX, curY];
      if (direction === "down") {
        fixedField.value = field.value;
        setNextBlock();
      } else if (direction === "rotate") {
        currentBlockRotate.value--;
      }
    }
  };

  const gameStart = () => {
    gameStatus.value = "playing";
    setNextBlock();
  };

  const tick = () => {
    moveBlock("down");
  };

  return {
    field,
    gameStatus: computed(() => gameStatus.value),
    moveBlock,
    gameStart,
    tick,
  };
};
