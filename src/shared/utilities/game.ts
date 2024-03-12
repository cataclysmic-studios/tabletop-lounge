import { Assets } from "./helpers";
import { type UnoCard, UnoSuit } from "shared/structs/uno";
import type { GoFishCard } from "shared/structs/go-fish";
import type { CardGame } from "shared/structs/game-types";
import Game from "shared/structs/game";
import type CardType from "shared/structs/card-type";

interface GameToCardType {
  [Game.Uno]: UnoCard;
  [Game.GoFish]: GoFishCard;
}

export function getCardModel(card: CardType): UnionOperation {
  const cardModels = <Folder>Assets.Games.FindFirstChild(card.game)?.FindFirstChild("Cards");
  switch(card.game) {
    case Game.Uno: {
      const modelFolder = card.suit === UnoSuit.None ? cardModels : cardModels.FindFirstChild(card.suit);
      return <UnionOperation>modelFolder?.FindFirstChild(card.name);
    }
    case Game.GoFish:
      return <UnionOperation>cardModels.FindFirstChild(card.name);
  }
}

export function getCardObject<CardGameType extends CardGame = CardGame, Card extends GameToCardType[CardGameType] = GameToCardType[CardGameType]>(cardGame: CardGameType, cardModel: UnionOperation): Card {
  switch(cardGame) {
    case Game.Uno: {
      const suitKey = <Maybe<keyof typeof UnoSuit>>cardModel.GetAttribute("Suit");
      const suit = suitKey === undefined ? UnoSuit.None : UnoSuit[suitKey];
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