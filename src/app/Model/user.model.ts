export class User {
  constructor(
    public email: string,
    public password: string,
    public status?: string,
    public id?: number,
    public username?: string
  ) {}
}

