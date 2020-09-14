import uuid
import requests

from ... import ChargeStatus, TransactionKind
from ...interface import GatewayConfig, GatewayResponse, PaymentData

secret_api_key = "sk_test_QVJqnjM3aEAu4mi65bYPtgFl"  # THis should go to config
authentication_header = "Bearer sk_test_QVJqnjM3aEAu4mi65bYPtgFl"
base_url = "https://api.tap.company/v2/"
headers = dict()
headers["Authorization"] = authentication_header


def dummy_success(): 
    return True


def get_client_token(card):
    r = requests.post("{}tokens", headers=headers, data=card).format(base_url)
    status_code = r.status_code
    return r.text.id


def authorize(
    payment_information: PaymentData, config: GatewayConfig
) -> GatewayResponse:
    payload = dict()
    payload["amount"] = payment_information.amount
    payload["currency"] = payment_information.currency
    customer = dict()
    customer["id"] = payment_information.customer_id
    customer["email"] = payment_information.email
    payload["customer"] = customer
    source = dict()
    source["id"] = payment_information.token
    payload["source"] = source
    error = None
    r = requests.post("{}authorize", headers=headers, data=payload).format(base_url)
    if r.status_code > 399:
        error = "Unable to authorize transaction"
    success = r.text
    return GatewayResponse(
        is_success=success.object == "authorize",
        action_required=False,
        kind=TransactionKind.AUTH,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=success.id,
        error=error
    )


def void(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    gatewayResponse = refund(payment_information)
    return gatewayResponse


def capture(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    """Perform capture transaction."""

    payload = dict()
    payload["amount"] = payment_information.amount
    payload["currency"] = payment_information.currency
    customer = dict()
    customer["id"] = payment_information.id
    customer["email"] = payment_information.email
    payload["customer"] = customer
    source = dict() 
    source["id"] = payment_information.token
    payload["source"] = source
    error = None
    r = requests.post("{}charges", headers=headers, data=payload).format(base_url)
    if r.status_code > 399:
        error = "Unable to capture payment"
    success = r.text
    return GatewayResponse(
        is_success=success.object == "charge",
        action_required=False,
        kind=TransactionKind.CAPTURE,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=success.id,
        error=error
    )


def confirm(payment_information: PaymentData, config: GatewayConfig) -> GatewayResponse:
    payload = dict()
    payload["amount"] = payment_information.amount
    payload["currency"] = payment_information.currency
    customer = dict()
    customer["id"] = payment_information.id
    customer["email"] = payment_information.email
    payload["customer"] = customer
    source = dict()
    source["id"] = payment_information.token
    payload["source"] = source
    error = None
    r = requests.post("{}charges", headers=headers, data=payload).format(base_url)
    if r.status_code > 399:
        error = "Unable to confirm payment"
    success = r.text
    return GatewayResponse(
        is_success=success.object == "charge",
        action_required=False,
        kind=TransactionKind.CAPTURE,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=success.id,
        error=error
    )


def refund(payment_information, config: GatewayConfig) -> GatewayResponse:
    payload = dict()
    payload["charge_id"] = payment_information.charge_id
    payload["amount"] = payment_information.amount
    payload["currency"] = payment_information.currency
    payload["reason"] = payment_information.reason
    error = None
    r = requests.post("{}refunds", headers=headers, data=payload).format(base_url)
    if r.status_code > 399:
        error = "Unable to process refund"
    success = r.text
    return GatewayResponse(
        is_success=error is None,
        action_required=False,
        kind=TransactionKind.REFUND,
        amount=payment_information.amount,
        currency=payment_information.currency,
        transaction_id=payment_information.token,
        error=error,
    )


def process_payment(
    payment_information: PaymentData, config: GatewayConfig
) -> GatewayResponse:
    """Process the payment."""
    token = payment_information.token

    # Process payment normally if payment token is valid
    if token not in dict(ChargeStatus.CHOICES):
        return capture(payment_information, config)

    # Process payment by charge status which is selected in the payment form
    # Note that is for testing by dummy gateway only
    charge_status = token
    authorize_response = authorize(payment_information, config)
    if charge_status == ChargeStatus.NOT_CHARGED:
        return authorize_response

    if not config.auto_capture:
        return authorize_response

    capture_response = capture(payment_information, config)
    if charge_status == ChargeStatus.FULLY_REFUNDED:
        return refund(payment_information, config)
    return capture_response
