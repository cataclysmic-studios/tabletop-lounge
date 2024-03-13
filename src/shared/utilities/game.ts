import { Assets } from "./helpers";
import { UnoSuit } from "shared/structs/cards/games/uno";
import Game from "shared/structs/game";
import GameToCard from "shared/structs/cards/game-to-card";
import type GameType from "shared/structs/game-types";
import type CardType from "shared/structs/cards/card-type";

interface GameInfo {
  readonly turnBased: boolean;
}

export function getGameInfo(_game: Game): GameInfo {
  switch(_game) {
    case Game.Uno:
      return {
        turnBased: true
      }
    case Game.GoFish:
      return {
        turnBased: true
      }
  }
}

export function getCardModel(card: CardType): BasePart {
  const cardModels = <Folder>Assets.Games.FindFirstChild(card.game)?.FindFirstChild("Cards");
  switch(card.game) {
    case Game.Uno: {
      const modelFolder = card.suit === UnoSuit.Wild ? cardModels : cardModels.FindFirstChild(card.suit);
      return <BasePart>modelFolder?.FindFirstChild(card.name);
    }
    case Game.GoFish:
      return <BasePart>cardModels.FindFirstChild(card.name);
  }
}

export function getCardObject<CardGameType extends GameType.CardGame, Card extends GameToCard[CardGameType] = GameToCard[CardGameType]>(cardGame: CardGameType, cardModel: BasePart): Card {
  switch(cardGame) {
    case Game.Uno: {
      const suitKey = <Maybe<keyof typeof UnoSuit>>cardModel.GetAttribute("Suit");
      const suit = suitKey === undefined ? UnoSuit.Wild : UnoSuit[suitKey];
      return <Card>{
        suit,
        name: cardModel.Name,
        game: cardGame
      };
    }
    case Game.GoFish: {
      return <Card>{
        game: cardGame
      };
    }
  }
  return <Card><unknown>undefined;
}