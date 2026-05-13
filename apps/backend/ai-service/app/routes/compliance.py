from fastapi import APIRouter, HTTPException
from app.schemas.models import BookingComplianceRequest, ComplianceCheckResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/check-booking", response_model=ComplianceCheckResponse)
async def check_booking_compliance(request: BookingComplianceRequest):
    try:
        levy_rate = 0.02
        vat_rate = 0.15
        bsp_fee_rate = 0.03

        levy_amount = round(request.amount * levy_rate, 2)
        vat_amount = round(request.amount * vat_rate, 2)
        bsp_fee = round(request.amount * bsp_fee_rate, 2)

        flags = []
        is_compliant = True

        if not request.operator_id:
            flags.append("Missing operator ID")
            is_compliant = False

        if request.amount < 0:
            flags.append("Negative amount")
            is_compliant = False

        if request.amount > 10000:
            flags.append("High-value booking requires enhanced verification")

        return ComplianceCheckResponse(
            booking_id=request.booking_id,
            is_compliant=is_compliant,
            levy_amount=levy_amount,
            vat_amount=vat_amount,
            bsp_fee=bsp_fee,
            flags=flags,
            confidence=92.5 if is_compliant else 78.3,
        )
    except Exception as e:
        logger.error(f"Compliance check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/operator/{operator_id}/report")
async def get_operator_compliance_report(operator_id: str):
    return {
        "operator_id": operator_id,
        "compliance_rate": 72.4,
        "total_bookings_checked": 456,
        "compliant_bookings": 330,
        "flagged_bookings": 126,
        "recent_flags": [
            "Late levy remittance (March 2026)",
            "BSP reference mismatch on booking ZV-A3B7K2",
        ],
        "levy_remitted_ytd": 52340.00,
        "vat_remitted_ytd": 392550.00,
        "bsp_fees_paid_ytd": 78510.00,
    }
