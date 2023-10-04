import type { VerificationProcedureInfo } from '@databank/types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class VerificationCode implements VerificationProcedureInfo {
  /** The number of previous attempts to verify this code */
  @Prop({ required: true })
  attemptsMade: number;

  /** The unix timestamp after which the code will be invalidated */
  @Prop({ required: true })
  expiry: number;

  /** The actual code the user must confirm */
  @Prop({ required: true })
  value: number;
}

export const VerificationCodeSchema = SchemaFactory.createForClass(VerificationCode);
