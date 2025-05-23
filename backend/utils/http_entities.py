from decimal import Decimal
from backend.utils.calculation_utils import calculate_finite_differences
from backend.utils.utils import generate_graph_points
from pydantic import BaseModel, validator
from typing import List, Optional

class DataInput(BaseModel):
    x_arr: List[Decimal]
    y_arr: List[Decimal]
    target_x: Decimal

    @validator('y_arr')
    def sort_and_validate_arrays(cls, y_arr, values):   
        x_arr = values['x_arr']
        sorted_pairs = sorted(zip(x_arr, y_arr), key=lambda pair: pair[0])
        
        values['x_arr'] = [x for x, y in sorted_pairs]
        return [y for x, y in sorted_pairs]


class ResultOutput(BaseModel):
    x_arr: List[Decimal]
    y_arr: List[Decimal]
    target_x: Decimal
    x_for_graph: List[Decimal]
    p_for_graph: List[Decimal]
    calculation_success: bool
    finite_differences: Optional[List[List[Decimal]]]
    target_y: Optional[Decimal]
    stirling_y: Optional[Decimal]
    bessel_y: Optional[Decimal]
    errors: Optional[List[str]]

    @classmethod
    def create(
        cls,
        data: DataInput,
        target_y,
        stirling_y,
        bessel_y,
        calculation_success,
        graph_info,
        errors,
        finite_differences = None,
    ):

        
        return cls(
            x_arr=data.x_arr,
            y_arr=data.y_arr,
            target_x=data.target_x,
            target_y=target_y,
            stirling_y=stirling_y,
            bessel_y=bessel_y,
            x_for_graph=graph_info[0] if graph_info is not None else [],
            p_for_graph=graph_info[1] if graph_info is not None else [],
            finite_differences=finite_differences,
            calculation_success=calculation_success,
            errors=errors
        )
    
    @classmethod
    def create_empty(cls, data, errors):
        return cls(
            x_arr=data.x_arr,
            y_arr=data.y_arr,
            target_x=data.target_x,
            target_y=None,
            stirling_y=None,
            bessel_y=None,
            x_for_graph=None,
            y_for_graph=None, 
            finite_differences=None,
            calculation_success=False,
            errors=errors
        )