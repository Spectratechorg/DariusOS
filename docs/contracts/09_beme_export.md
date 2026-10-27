# Contract 09: BEME Export (Bill of Engineering Measurement and Evaluation)

## Purpose
Specifies the bill of quantities itemization linking directly to earthwork calculations and placeholder engineering unit rates for Excel export.

## Format
JSON / Pydantic Model: `BemeBillOfQuantities`

```json
{
  "project_name": "Site Access Road Alpha",
  "currency": "USD",
  "generated_at": "2026-10-27T08:35:00Z",
  "status_disclaimer": "PRELIMINARY DEMO RATES - TO BE CONFIRMED BY A REGISTERED ENGINEER",
  "bill_items": [
    {
      "item_number": "1.01",
      "description": "Site clearance and bush clearing along road corridor",
      "unit": "m2",
      "quantity": 11180.3,
      "rate": 1.50,
      "amount": 16770.45
    },
    {
      "item_number": "2.01",
      "description": "Roadbed excavation in common material (Cut)",
      "unit": "m3",
      "quantity": 2400.0,
      "rate": 6.50,
      "amount": 15600.00
    },
    {
      "item_number": "2.02",
      "description": "Embankment formation from approved cut/borrow (Fill)",
      "unit": "m3",
      "quantity": 1950.0,
      "rate": 8.00,
      "amount": 15600.00
    }
  ],
  "grand_total": 47970.45
}
```
