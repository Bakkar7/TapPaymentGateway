import * as S from "./styles";

import { ErrorMessage, StripeInputElement } from "@components/atoms";
import React, { useState } from "react";

import { Formik } from "formik";
import { IFormError } from "@types";
import { IProps } from "./types";

/**
 * Stripe credit card form.
 */
const TapCreditCardForm: React.FC<IProps> = ({
  formRef,
  formId,
  errors = [],
  onSubmit,
}: IProps) => {


  const [tapErrors, setTapErrors] = useState<IFormError[]>([]);

  const allErrors = [...errors, ...tapErrors];

  return (
    <Formik
      initialValues={null}
      onSubmit={async (values, { setSubmitting }) => {
        // await onSubmit(stripe, elements); //TODO handleOnsubmit 
        setSubmitting(false);
      }}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        isSubmitting,
        isValid,
      }) => (
        <S.Form id={formId} ref={formRef} onSubmit={handleSubmit}>
          <S.Card>
            <S.CardNumberField>
              <StripeInputElement
                type="CardNumber"
                label="Card number"
                onChange={event => {
                  handleChange(event);
                  setTapErrors([]);
                }}
              />
            </S.CardNumberField>
            <S.CardExpiryField>
              <StripeInputElement
                type="CardExpiry"
                label="Expiration date"
                onChange={event => {
                  handleChange(event);
                  setTapErrors([]);
                }}
              />
            </S.CardExpiryField>
            <S.CardCvcField>
              <StripeInputElement
                type="CardCvc"
                label="CVC"
                onChange={event => {
                  handleChange(event);
                  setTapErrors([]);
                }}
              />
            </S.CardCvcField>
          </S.Card>
          <ErrorMessage errors={allErrors} />
        </S.Form>
      )}
    </Formik>
  );
};

export { TapCreditCardForm };
