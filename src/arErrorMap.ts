import { ZodErrorMap, ZodIssueCode, ZodParsedType } from 'zod';
import { util } from './util';

export const arErrorMap: ZodErrorMap = (issue, _ctx) => {
    let message: string;
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = 'مطلوب';
            } else {
                message = `المتوقع ${issue.expected}, المستلم ${issue.received}`;
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = `قيمة حرفية غير صالحة, المتوقع ${JSON.stringify(
                issue.expected,
                util.jsonStringifyReplacer,
            )}`;
            break;
        case ZodIssueCode.unrecognized_keys:
            message = `عنصر (عناصر) غير معروف في الكائن: ${util.joinValues(
                issue.keys,
                ', ',
            )}`;
            break;
        case ZodIssueCode.invalid_union:
            message = `مدخل غير صالح`;
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = `قيمة غير صالحة. المتوقع ${util.joinValues(
                issue.options,
            )}`;
            break;
        case ZodIssueCode.invalid_enum_value:
            message = `قيمة غير صالحة. المتوقع ${util.joinValues(
                issue.options,
            )}, المتلقى '${issue.received}'`;
            break;
        case ZodIssueCode.invalid_arguments:
            message = `قيمة غير صالحة`;
            break;
        case ZodIssueCode.invalid_return_type:
            message = `قيمة غير صالحة`;
            break;
        case ZodIssueCode.invalid_date:
            message = `قيمة غير صالحة`;
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === 'object') {
                if ('startsWith' in issue.validation) {
                    message = `قيمة غير صالحة: يجب أن يبدأ بـ  "${issue.validation.startsWith}"`;
                } else if ('endsWith' in issue.validation) {
                    message = `قيمة غير صالحة: يجب ان ينتهي بـ "${issue.validation.endsWith}"`;
                } else {
                    util.assertNever(issue.validation);
                }
            } else if (issue.validation !== 'regex') {
                message = `غير صالح ${issue.validation}`;
            } else {
                message = 'غير صالح';
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === 'array')
                message = `يجب ان يحتوي على عناصر  ${
                    issue.inclusive ? `الأقل` : `أكثر`
                } ${issue.minimum} عناصر`;
            else if (issue.type === 'string')
                message = `النص يجب أن يحتوي على  ${
                    issue.inclusive ? `الأقل` : `اكثر`
                } ${issue.minimum} حروف`;
            else if (issue.type === 'number')
                message = `الرقم يجب أن يكون أكثر من  ${
                    issue.inclusive ? `أو يساوي ` : ``
                }${issue.minimum}`;
            else if (issue.type === 'date')
                message = `التاريخ يجب ان يكون أكبر من  ${
                    issue.inclusive ? `أو يساوي ` : ``
                }${new Date(issue.minimum)}`;
            else message = 'قيمة غير صالحة';
            break;
        case ZodIssueCode.too_big:
            if (issue.type === 'array')
                message = `يجب ان يحتوي على عناصر  ${
                    issue.inclusive ? `على الأكثر` : `اقل من `
                } ${issue.maximum} عناصر`;
            else if (issue.type === 'string')
                message = `النص يجب أن يحتوي على  ${
                    issue.inclusive ? ` الأكثر` : `أقل `
                } ${issue.maximum} حرف`;
            else if (issue.type === 'number')
                message = `الرقم يجب ان يكون أقل من  ${
                    issue.inclusive ? `أو يساوي ` : ``
                }${issue.maximum}`;
            else if (issue.type === 'date')
                message = `التاريخ يجب ان يكون أصغر من  ${
                    issue.inclusive ? `أو يساوي ` : ``
                }${new Date(issue.maximum)}`;
            else message = 'قيمة غير صالحة';
            break;
        case ZodIssueCode.custom:
            message = `مدخل غير صالح`;
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = `تعذر دمج نتائج التقاطع`;
            break;
            case ZodIssueCode.not_multiple_of:
                message = `الرقم يجب أن يكون من مضروب الـ  ${issue.multipleOf}`;
                break;
        default:
            message = _ctx.defaultError;
            util.assertNever(issue);
    }
    return { message };
};

