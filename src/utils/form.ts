import { useCallback, useState, type ChangeEvent } from 'react';

export type FormErrors = Record<string, string>;
type FormValues = Record<string, string>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validate: (values: T) => FormErrors;
}

/**
 * Lightweight controlled-form helper: change handling, per-field error state,
 * and a single validateNow() gate used at submit time.
 */
export function useForm<T extends FormValues>({ initialValues, validate }: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const target = e.target;
      const value =
        target.type === 'checkbox' ? String((target as HTMLInputElement).checked) : target.value;
      setValues((prev) => ({ ...prev, [target.name]: value }));
    },
    [],
  );

  const setField = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validateNow = useCallback((): boolean => {
    const errs = validate(values);
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [validate, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    setField,
    handleChange,
    validateNow,
    setErrors,
    submitting,
    setSubmitting,
    reset,
  };
}
