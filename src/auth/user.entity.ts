import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { compare, genSalt, hash } from 'bcrypt';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  async hashPassword(): Promise<void> {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
  }

  async validatePassword(password: string): Promise<Boolean> {
    return await compare(password, this.password);
  }
}
