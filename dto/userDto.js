export class UserDto {
    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        // хз зачем
        this.isActivated = model.isActivated;
    }
}