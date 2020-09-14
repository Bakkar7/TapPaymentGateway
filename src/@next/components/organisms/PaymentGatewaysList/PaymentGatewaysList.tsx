import * as S from "./styles";

import {
  BraintreePaymentGateway,
  DummyPaymentGateway,
  StripePaymentGateway,
  TapPaymentGateway
} from "..";
import { ErrorMessage, Radio } from "@components/atoms";

import { IProps } from "./types";
import { PROVIDERS } from "@temp/core/config";
import React from "react";

//     const { dataError } = await createPayment(gateway, token, cardData);
/**
 * Payment Gateways list
 */
const PaymentGatewaysList: React.FC<IProps> = ({
  paymentGateways,
  selectedPaymentGateway,
  selectedPaymentGatewayToken,
  selectPaymentGateway,
  formRef,
  formId,
  processPayment,
  errors,
  onError,
}: IProps) => {
  return (
    <S.Wrapper>
      {paymentGateways.map(({ id, name, config }, index) => {
        const checked = selectedPaymentGateway === id;

        switch (name) {
          case PROVIDERS.BRAINTREE.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-cy="checkoutPaymentGatewayBraintreeInput"
                    name="payment-method"
                    value="credit-card"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel={true}
                  >
                    <span data-cy="checkoutPaymentGatewayBraintreeName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <BraintreePaymentGateway
                    config={config}
                    formRef={formRef}
                    formId={formId}
                    processPayment={(token, cardData) =>
                      processPayment(id, token, cardData)
                    }
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );

          case PROVIDERS.DUMMY.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-cy="checkoutPaymentGatewayDummyInput"
                    name="payment-method"
                    value="dummy"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel={true}
                  >
                    <span data-cy="checkoutPaymentGatewayDummyName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <DummyPaymentGateway
                    formRef={formRef}
                    formId={formId}
                    processPayment={token => processPayment(id, token)}
                    initialStatus={selectedPaymentGatewayToken}
                  />
                )}
              </div>
            );

            case PROVIDERS.TAP.label:
              return (
                <div key={index}>
                  <S.Tile checked={checked}>
                    <Radio
                      data-cy="checkoutPaymentGatewayTapInput"
                      name="payment-method"
                      value="tap"
                      checked={checked}
                      onChange={() =>
                        selectPaymentGateway && selectPaymentGateway(id)
                      }
                      customLabel={true}
                    >
                      <span data-cy="checkoutPaymentGatewayTapName">
                        {name}
                      </span>
                    </Radio>
                  </S.Tile>
                    <TapPaymentGateway open={checked}
                    />
                </div>
              );

          case PROVIDERS.STRIPE.label:
            return (
              <div key={index}>
                <S.Tile checked={checked}>
                  <Radio
                    data-cy="checkoutPaymentGatewayStripeInput"
                    name="payment-method"
                    value="stripe"
                    checked={checked}
                    onChange={() =>
                      selectPaymentGateway && selectPaymentGateway(id)
                    }
                    customLabel={true}
                  >
                    <span data-cy="checkoutPaymentGatewayStripeName">
                      {name}
                    </span>
                  </Radio>
                </S.Tile>
                {checked && (
                  <StripePaymentGateway
                    config={config}
                    formRef={formRef}
                    formId={formId}
                    processPayment={(token, cardData) =>
                      processPayment(id, token, cardData)
                    }
                    errors={errors}
                    onError={onError}
                  />
                )}
              </div>
            );
        }
      })}
      {!selectedPaymentGateway && errors && <ErrorMessage errors={errors} />}
    </S.Wrapper>
  );
};

export { PaymentGatewaysList };
