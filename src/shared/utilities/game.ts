import { Assets } from "./helpers";
import { UnoSuit } from "shared/structs/uno";
import type { CardGame } from "shared/structs/game-types";
import Game from "shared/structs/game";
import GameToCardType from "shared/structs/game-to-card";
import type CardType from "shared/structs/card-type";

export function getCardModel(card: CardType): BasePart {
  const cardModels = <Folder>Assets.Games.FindFirstChild(card.game)?.FindFirstChild("Cards");
  switch(card.game) {
    case Game.Uno: {
      const modelFolder = card.suit === UnoSuit.None ? cardModels : cardModels.FindFirstChild(card.suit);
      return <BasePart>modelFolder?.FindFirstChild(card.name);
    }
    case Game.GoFish:
      return <BasePart>cardModels.FindFirstChild(card.name);
  }
}

export function getCardObject<CardGameType extends CardGame = CardGame, Card extends GameToCardType[CardGameType] = GameToCardType[CardGameType]>(cardGame: CardGameType, cardModel: BasePart): Card {
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