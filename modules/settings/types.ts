import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm';

import { Maybe } from '../shared/types';
import { AppPreferences } from './constants';

@Entity('app_preferences')
export class AppPreference extends BaseEntity {
  @PrimaryColumn('text')              id: string;
  @Column('text', { nullable: true }) value?: Maybe<string>;
  @CreateDateColumn()                 createdAt: Date;
  @UpdateDateColumn()                 updatedAt: Date;
}

export type AppPreferenceInput = {
  id: AppPreferences;
  value?: Maybe<string>;
}
