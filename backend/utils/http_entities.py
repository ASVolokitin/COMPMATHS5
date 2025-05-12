from decimal import Decimal
from backend.utils.calculation_utils import calculate_finite_differences
from backend.utils.utils import generate_graph_points
from pydantic import BaseModel, field_serializer
from typing import List, Optional

class DataInput(BaseModel):
    x_arr: List[Decimal]
    y_arr: List[Decimal]
    target_x: Decimal


class ResultOutput(BaseModel):
    x_arr: List[Decimal]
    y_arr: List[Decimal]
    target_x: Decimal
    x_for_graph: List[Decimal]
    p_for_graph: List[Decimal]
    calculation_success: bool
    best_interpolation: bool
    finite_differences: Optional[List[List[Decimal]]]
    target_y: Optional[Decimal]
    errors: Optional[List[str]]

    @classmethod
    def create(
        cls,
        data: DataInput,
        target_y,
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
            x_for_graph=graph_info[0] if graph_info is not None else [],
            p_for_graph=graph_info[1] if graph_info is not None else [],
            finite_differences=finite_differences,
            calculation_success=calculation_success,
            best_interpolation=False,
            errors=errors
        )
    
    @classmethod
    def create_empty(cls, data, errors):
        return cls(
            x_arr=data.x_arr,
            y_arr=data.y_arr,
            target_x=data.target_x,
            target_y=None,
            x_for_graph=None, # мб здесь надо поставить []
            y_for_graph=None, # мб здесь надо поставить []
            finite_differences=None, # мб здесь надо поставить []
            calculation_success=False,
            best_interpolation=False,
            errors=errors
        )