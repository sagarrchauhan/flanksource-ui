import { Control, Controller, FieldErrors } from "react-hook-form";
import { TextInput } from "../../TextInput";

type MicrosoftProps = {
  control: Control;
  errors: FieldErrors;
};

export const Microsoft = ({ control, errors }: MicrosoftProps) => {
  return (
    <div>
      <div className="mb-4">
        <Controller
          control={control}
          name="product"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Product"
                id="product"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.product?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="category"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Category"
                id="category"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.category?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="description"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Description"
                id="description"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.description?.message}</p>
      </div>
      <div className="mb-4">
        <Controller
          control={control}
          name="body"
          rules={{
            required: "Please provide valid value"
          }}
          render={({ field }) => {
            const { onChange, value } = field;
            return (
              <TextInput
                label="Body"
                id="body"
                className="w-full"
                onChange={onChange}
                value={value}
              />
            );
          }}
        />
        <p className="text-red-600 text-sm">{errors.body?.message}</p>
      </div>
    </div>
  );
};
