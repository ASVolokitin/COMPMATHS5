from decimal import Decimal
import decimal
from typing import List
from backend.utils.calculation_utils import bessel_interpolation, calculate_finite_differences, stirling_interpolation
from backend.utils.exceptions import UnequallySpacedXException
from backend.utils.http_entities import DataInput
from backend.utils.http_entities import ResultOutput
from backend.utils.util_entities import ErrorCodes
from backend.utils.utils import generate_graph_points

def generate_result(
    data: DataInput,
    polynomial,
    errors,
    calculation_success: bool,
    finite_differences: List[List[Decimal]] = None
):
    target_y = polynomial(data.target_x) if polynomial and calculation_success else None
    if target_y is None:
        calculation_success = False
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_TARGET_Y)

    try:    
        stirling_y = stirling_interpolation(data.x_arr, data.y_arr, data.target_x)
    except Exception:
        stirling_y = None
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_STIRLING)

    # if stirling_y is not None and target_y is not None and not (Decimal(-1.05) * target_y <= stirling_y <= Decimal(1.05) * target_y):
    #     stirling_y = None

    try:    
        bessel_y = bessel_interpolation(data.x_arr, data.y_arr, data.target_x)
    except Exception:
        bessel_y = None
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_BESSEL)

    # if bessel_y is not None and target_y is not None and not (Decimal(-1.05) * target_y <= bessel_y <= Decimal(1.05) * target_y):
    #     bessel_y = None

    graph_info = generate_graph_points(data.x_arr, polynomial, errors) if polynomial else None
    if graph_info is None: 
        calculation_success = False
        errors.append(ErrorCodes.UNABLE_TO_CALCULATE_GRAPH_POINTS)

    if len(data.x_arr) % 2 == 0:
        bessel_y = None
        errors.append("Couldn't calculate Bessel (even amount of points).")
    else: 
        stirling_y = None
        errors.append("Couldn't calculate Stirling (odd amount of points).")
    
    return ResultOutput.create(
        data=data,
        target_y=target_y,
        stirling_y=stirling_y,
        bessel_y=bessel_y,
        calculation_success=calculation_success,
        errors=errors,
        graph_info=graph_info,
        finite_differences=finite_differences
    )