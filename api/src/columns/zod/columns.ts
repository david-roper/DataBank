import type { PermissionLevel } from '@prisma/client';
import { z } from 'zod';

const $PermissionLevel: Zod.ZodType<PermissionLevel> = z.enum(['PUBLIC', 'LOGIN', 'VERIFIED', 'MANAGER']);

// ---------------------- Column Summaries ---------------------
const $BaseSummary = z.object({
  count: z.number().int(),
  nullCount: z.number().int()
});
type BaseSummary = z.infer<typeof $BaseSummary>;

const $IntSummary = $BaseSummary.extend({
  max: z.number().int(),
  mean: z.number(),
  median: z.number(),
  min: z.number().int(),
  mode: z.number().int(),
  std: z.number()
});
type IntSummary = z.infer<typeof $IntSummary>;

const $FloatSummary = $BaseSummary.extend({
  max: z.number(),
  mean: z.number(),
  median: z.number(),
  min: z.number(),
  std: z.number()
});
type FloatSummary = z.infer<typeof $FloatSummary>;

const $EnumSummary = $BaseSummary.extend({
  distribution: z.record(z.number().int())
});
type EnumSummary = z.infer<typeof $EnumSummary>;

const $DatetimeSummary = $BaseSummary.extend({
  max: z.date(),
  min: z.date()
});
type DatetimeSummary = z.infer<typeof $DatetimeSummary>;

export const $ColumnSummary = z.union([
  $BaseSummary,
  $IntSummary,
  $FloatSummary,
  $EnumSummary,
  $DatetimeSummary
]) satisfies z.ZodType<ColumnSummary>;
export type ColumnSummary = BaseSummary | DatetimeSummary | EnumSummary | FloatSummary | IntSummary;

// ----------------------- Column Validation -----------------------
// const $StringColumnValidation = z.object({
//   max: z.number().int(),
//   mean: z.number(),
//   median: z.number(),
//   min: z.number().int(),
//   mode: z.number().int(),
//   std: z.number()
// });

// const $NumericColumnValidation = z.object({
//   max: z.number().int(),
//   min: z.number().int()
// });

// export const $EnumColumnValidation = z.object({
//   allowedValues: z.string().array()
// });

// export const $DatetimeValidation = z.object({
//   max: z.date(),
//   min: z.date()
//   // pass ISO
// });

// ---------------------------------------------------

const $TabularColumnInfo = z.object({
  dataPermission: $PermissionLevel,
  description: z.string().optional(),
  id: z.string(),
  name: z.string(),
  nullable: z.boolean(),
  summaryPermission: $PermissionLevel,
  tabularDataId: z.string()
});

const $StringColumn = $TabularColumnInfo.extend({
  kind: z.literal('STRING'),
  stringData: z.string().array(),
  summary: $BaseSummary
});
export type StringColumn = z.infer<typeof $StringColumn>;

const $CreateStringColumnDto = $StringColumn.omit({
  id: true
});
export type CreateStringColumnDto = z.infer<typeof $CreateStringColumnDto>;
const $UpdateStringColumnDto = $CreateStringColumnDto.partial();
export type UpdateStringColumnDto = z.infer<typeof $UpdateStringColumnDto>;

const $IntColumn = $TabularColumnInfo.extend({
  intData: z.number().int().array(),
  kind: z.literal('INT'),
  summary: $IntSummary
});
export type IntColumn = z.infer<typeof $IntColumn>;

const $CreateIntColumnDto = $IntColumn.omit({
  id: true
});
export type CreateIntColumnDto = z.infer<typeof $CreateIntColumnDto>;
const $UpdateIntColumnDto = $CreateIntColumnDto.partial();
export type UpdateIntColumnDto = z.infer<typeof $UpdateIntColumnDto>;

const $FloatColumn = $TabularColumnInfo.extend({
  floatData: z.number().array(),
  kind: z.literal('FLOAT'),
  summary: $FloatSummary
});
export type FloatColumn = z.infer<typeof $FloatColumn>;

const $CreateFloatColumnDto = $FloatColumn.omit({
  id: true
});
export type CreateFloatColumnDto = z.infer<typeof $CreateFloatColumnDto>;
const $UpdateFloatColumnDto = $CreateFloatColumnDto.partial();
export type UpdateFloatColumnDto = z.infer<typeof $UpdateFloatColumnDto>;

const $EnumColumn = $TabularColumnInfo.extend({
  enumData: z.string().array(),
  kind: z.literal('ENUM'),
  summary: $EnumSummary
});
export type EnumColumn = z.infer<typeof $EnumColumn>;

const $CreateEnumColumnDto = $EnumColumn.omit({
  id: true
});
export type CreateEnumColumnDto = z.infer<typeof $CreateEnumColumnDto>;
const $UpdateEnumColumnDto = $CreateEnumColumnDto.partial();
export type UpdateEnumColumnDto = z.infer<typeof $UpdateEnumColumnDto>;

const $DatetimeColumn = $TabularColumnInfo.extend({
  datetimeData: z.date().array(),
  kind: z.literal('DATETIME'),
  summary: $DatetimeSummary
});
type DatetimeColumn = z.infer<typeof $DatetimeColumn>;

const $BooleanColumn = $TabularColumnInfo.extend({
  booleanData: z.boolean().array(),
  kind: z.literal('BOOLEAN'),
  summary: $DatetimeSummary
});
type BooleanColumn = z.infer<typeof $BooleanColumn>;

const $CreateDatetimeColumnDto = $DatetimeColumn.omit({
  id: true
});
export type CreateDatetimeColumnDto = z.infer<typeof $CreateDatetimeColumnDto>;
const $UpdateDatetimeColumnDto = $CreateDatetimeColumnDto.partial();
export type UpdateDatetimeColumnDto = z.infer<typeof $UpdateDatetimeColumnDto>;

export const $TabularColumn = z.union([
  $StringColumn,
  $IntColumn,
  $FloatColumn,
  $EnumColumn,
  $DatetimeColumn,
  $BooleanColumn
]) satisfies z.ZodType<TabularColumn>;
export type TabularColumn = BooleanColumn | DatetimeColumn | EnumColumn | FloatColumn | IntColumn | StringColumn;

export const $CreateTabularColumnDto = z.union([
  $CreateStringColumnDto,
  $CreateIntColumnDto,
  $CreateFloatColumnDto,
  $CreateEnumColumnDto,
  $CreateDatetimeColumnDto
]) satisfies z.ZodType<CreateTabularColumnDto>;
export type CreateTabularColumnDto =
  | CreateDatetimeColumnDto
  | CreateEnumColumnDto
  | CreateFloatColumnDto
  | CreateIntColumnDto
  | CreateStringColumnDto;
export type UpdateTabularColumnDto =
  | UpdateDatetimeColumnDto
  | UpdateEnumColumnDto
  | UpdateFloatColumnDto
  | UpdateIntColumnDto
  | UpdateStringColumnDto;
