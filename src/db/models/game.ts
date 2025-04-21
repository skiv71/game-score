import {
    IModel,
    Model
} from "../model"

interface IGame extends IModel {
    name: string
}

export default class Game extends Model<IGame> {

    public name: string

    constructor(
        game: IGame
    ) {
        super(game)
        this.name = game.name
    }

}
