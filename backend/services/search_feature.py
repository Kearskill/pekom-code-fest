"""
Search and filter functionality - Pure Python/Pandas
"""

import pandas as pd
from typing import List, Dict, Optional
from .utils import (
    load_data, is_open_now, is_wheelchair_accessible,
    matches_halal_requirement, extract_price_min, format_place_response
)


def search_places(
    place_type: str = "All",
    price_range: str = "All",
    halal_status: str = "No preference",
    accessibility: str = "No preference",
    search_query: str = "",
    filter_open_now: bool = False,
    current_time: Optional[str] = None
) -> List[Dict]:
    """
    Search and filter places based on criteria.
    Returns list of place dictionaries.
    """
    df = load_data()
    
    # Filter by place type
    if place_type != "All":
        df = df[df["Type"] == place_type]
    
    # Filter by halal status
    if halal_status == "Halal only":
        df = df[df["Halal_Status"].isin(["Halal", "Muslim-Friendly"])]
    
    # Filter by accessibility
    if accessibility == "Wheelchair-friendly":
        df = df[df["Accessibility_Info"].apply(
            lambda x: is_wheelchair_accessible(x) if pd.notna(x) else False
        )]
    
    # Filter by price range
    if price_range != "All":
        price_map = {
            "Budget": (0, 30),
            "Medium": (30, 80),
            "Premium": (80, 9999)
        }
        if price_range in price_map:
            min_price, max_price = price_map[price_range]
            df = df[df["Price_Range"].apply(
                lambda x: min_price <= extract_price_min(x) <= max_price
            )]
    
    # Filter by open now
    if filter_open_now:
        df = df[df["Opening_Hours"].apply(
            lambda x: is_open_now(x, current_time)
        )]
    
    # Text search
    if search_query:
        query_lower = search_query.lower()
        mask = (
            df["Name"].str.lower().str.contains(query_lower, na=False) |
            df["Description"].str.lower().str.contains(query_lower, na=False) |
            df["Category"].str.lower().str.contains(query_lower, na=False) |
            df.get("Cuisine", pd.Series()).str.lower().str.contains(query_lower, na=False) |
            df.get("Famous_Dish", pd.Series()).str.lower().str.contains(query_lower, na=False)
        )
        df = df[mask]
    
    # Convert to list of dicts
    results = [format_place_response(row) for _, row in df.iterrows()]
    
    return results