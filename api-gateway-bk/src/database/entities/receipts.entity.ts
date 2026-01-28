import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('receipts')
export class Receipt {
  @PrimaryGeneratedColumn('uuid')
  receiptId: string;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  issuedAt: Date;
}
