"""
Utility functions for data processing
No JamAI dependencies - pure Python logic
"""

import pandas as pd
from datetime import datetime, time
import re
from typing import Optional, List, Dict, Any
import os
from functools import lru_cache

# Get the data directory path
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

# Global cache variable
_DF_CACHE = None

def load_data() -> pd.DataFrame:
    """
    Load the tourism data with caching to prevent re-reading disk.
    """
    global _DF_CACHE
    if _DF_CACHE is not None:
        return _DF_CACHE

    csv_path = os.path.join(DATA_DIR, "combine_new.csv")
    parquet_path = os.path.join(DATA_DIR, "combined.parquet")
    
    if os.path.exists(parquet_path):
        _DF_CACHE = pd.read_parquet(parquet_path)
    elif os.path.exists(csv_path):
        _DF_CACHE = pd.read_csv(csv_path)
    else:
        raise FileNotFoundError(
            f"No data file found. Place combine_new.csv or combined.parquet in {DATA_DIR}"
        )
    
    # Standardize column names to avoid key errors later
    # _DF_CACHE.columns = _DF_CACHE.columns.str.strip() 
    return _DF_CACHE

def parse_time(time_str: str) -> Optional[time]:
    """Convert time string to datetime.time object"""
    if not isinstance(time_str, str):
        return None
    time_str = time_str.strip().upper()
    try:
        return datetime.strptime(time_str, "%H:%M").time()
    except ValueError:
        try:
            return datetime.strptime(time_str, "%I:%M %p").time()
        except ValueError:
            return None

def is_open_now(opening_hours_str: str, check_time: Optional[str] = None) -> bool:
    """Check if a place is open at given time"""
    if pd.isna(opening_hours_str):
        return False
    
    opening_hours_str = str(opening_hours_str).strip()
    
    if "24/7" in opening_hours_str or "24 HOURS" in opening_hours_str.upper():
        return True
    
    # Handle check_time
    if check_time is None:
        # WARNING: This uses server time. Ideally, pass a timezone-aware time from the frontend.
        check_time_obj = datetime.now().time()
    else:
        check_time_obj = parse_time(check_time)
        if check_time_obj is None:
            return False
    
    # Regex improved to be slightly more lenient with spaces
    pattern = r'(\d{1,2}:\d{2})\s*(?:-|to)\s*(\d{1,2}:\d{2})'
    match = re.search(pattern, opening_hours_str, re.IGNORECASE)
    
    if match:
        open_time = parse_time(match.group(1))
        close_time = parse_time(match.group(2))
        
        if open_time and close_time:
            if close_time < open_time: # Crosses midnight (e.g. 18:00 - 02:00)
                return check_time_obj >= open_time or check_time_obj <= close_time
            else: # Standard day (e.g. 09:00 - 17:00)
                return open_time <= check_time_obj <= close_time
    
    return False

def is_wheelchair_accessible(accessibility_info: str) -> bool:
    if pd.isna(accessibility_info):
        return False
    
    info = str(accessibility_info).lower()
    
    # Check negatives first
    if any(x in info for x in ['not wheelchair', 'no wheelchair', 'stairs only', 'no elevator']):
        return False
        
    # Check positives
    positive_keywords = ['wheelchair', 'ramp', 'lift', 'elevator', 'accessible']
    return any(x in info for x in positive_keywords)

def matches_halal_requirement(place_halal_status: str, user_requirement: str) -> bool:
    if not user_requirement or user_requirement == "No preference":
        return True
    
    if pd.isna(place_halal_status):
        return False
    
    status = str(place_halal_status).strip().lower()
    return status in ["halal", "muslim-friendly"]

def extract_price_min(price_str: str) -> int:
    if pd.isna(price_str):
        return 999999
    
    p_str = str(price_str).upper().strip()
    if "FREE" in p_str:
        return 0
    
    # Extract all numbers, take the first one found
    numbers = re.findall(r'\d+', p_str)
    if numbers:
        return int(numbers[0])
    
    return 999999

def format_place_response(row: pd.Series) -> Dict[str, Any]:
    """
    Formats the row into a dictionary.
    """
    # Map CSV column names to output JSON keys
    field_mapping = {
        "Name": "name",
        "Type": "type",  # <--- CHANGED: Was "place_type", now "type" to match Pydantic
        "Description": "description",
        "Category": "category",
        "Contact": "contact",
        "Ticket_Price": "ticket_price",
        "Price_Range": "price_range",
        "Halal_Status": "halal_status",
        "Accessibility_Info": "accessibility_info",
        "Open_Now": "open_now",
        "Image_URL": "image_url",
        "Address": "address",
        "How_to_Get_There": "how_to_get_there",
        "Opening_Hours": "opening_hours"
    }
    
    result = {}
    for col_name, output_key in field_mapping.items():
        val = row.get(col_name)
        # Convert NaN to empty string/None for JSON safety
        if pd.isna(val):
            result[output_key] = None
        else:
            result[output_key] = str(val)

    # Handle the computed Open_Now if it exists in the row, otherwise default false
    if "open_now" not in result:
        result["open_now"] = False
        
    return result
    
    result = {}
    for col_name, output_key in field_mapping.items():
        val = row.get(col_name)
        # Convert NaN to empty string/None for JSON safety
        if pd.isna(val):
            result[output_key] = None
        else:
            result[output_key] = str(val)

    # Handle the computed Open_Now if it exists in the row, otherwise default false
    if "open_now" not in result:
        result["open_now"] = False
        
    return result

def lookup_place_by_name(place_name: str) -> Optional[Dict]:
    """Look up a place by name."""
    df = load_data()
    
    if not place_name:
        return None

    # Lowercase search for case-insensitive matching
    place_name_lower = place_name.lower().strip()
    
    # Create a lowercased series for comparison to avoid re-computing it
    # (In high perf scenarios, cache the lowercased name column too)
    names_lower = df["Name"].astype(str).str.lower()
    
    # 1. Exact Match
    match = df[names_lower == place_name_lower]
    
    # 2. Contains Match (Fuzzy) if exact fails
    if match.empty:
        match = df[names_lower.str.contains(place_name_lower, regex=False)]
    
    if not match.empty:
        # Return the first match
        return format_place_response(match.iloc[0])
    
    return None

def enrich_itinerary_activity(activity: Dict) -> Dict:
    """
    Enrich an itinerary activity with full place data.
    """
    place_name = activity.get("place", "")
    place_data = lookup_place_by_name(place_name)
    
    # Start with existing activity data
    enriched = activity.copy()
    
    if place_data:
        # Safely update using data from DB
        # Only overwrite if the DB has data (not None)
        fields_to_enrich = [
            "image_url", "address", "opening_hours", 
            "price_range", "halal_status", "description", 
            "accessibility_info", "how_to_get_there"
        ]
        
        for field in fields_to_enrich:
            if place_data.get(field):
                enriched[field] = place_data[field]
                
    return enriched