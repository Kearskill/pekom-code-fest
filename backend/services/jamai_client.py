"""
JamAI Base client wrapper for Trip Planner Action Table

Based on working JamAI Base integration patterns.
Key imports: jamaibase.JamAI and jamaibase.types (not protocol!)
"""

import os
import json
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

# ============================================
# CORRECT IMPORT - use 'types as t' not 'protocol as p'
# ============================================
from typing import TYPE_CHECKING
import importlib
import importlib.util
from collections import defaultdict

# Allow type-checkers to see the jamaibase types without forcing a static import at runtime
if TYPE_CHECKING:
    from jamaibase import JamAI, types as t  # type: ignore

# Dynamically load jamaibase if available to avoid static "module not found" errors in editors
try:
    spec = importlib.util.find_spec("jamaibase")
    if spec is not None:
        jamaibase = importlib.import_module("jamaibase")
        JamAI = getattr(jamaibase, "JamAI", None)
        t = getattr(jamaibase, "types", None)
        JAMAI_AVAILABLE = True if JamAI and t else False
    else:
        JAMAI_AVAILABLE = False
except Exception:
    JAMAI_AVAILABLE = False

if not JAMAI_AVAILABLE:
    print("Warning: jamaibase not installed. Run: pip install jamaibase")


def _safe_text(cell: Any) -> str:
    """
    Safely extract text from a JamAI cell object.
    Handles None, missing attributes, and various response formats.
    """
    if cell is None:
        return ""
    try:
        return getattr(cell, "text", "") or ""
    except Exception:
        return str(cell) if cell else ""


class JamAIClient:
    """
    Wrapper for JamAI Base Action Table operations.
    
    Usage:
        client = JamAIClient()
        result = client.generate_itinerary(
            start_time="09:00",
            dietary="Halal only",
            transport="Own vehicle",
            accessibility="Wheelchair-friendly"
        )
    """
    
    def __init__(self):
        """Initialize JamAI client with env vars."""
        if not JAMAI_AVAILABLE:
            self.client = None
            return
        
        project_id = os.getenv("JAMAI_PROJECT_ID")
        api_key = os.getenv("JAMAI_API_KEY")
        
        if not project_id or not api_key:
            raise ValueError(
                "Missing JamAI credentials. Set JAMAI_PROJECT_ID and JAMAI_API_KEY in .env"
            )
        
        # Initialize client
        self.client = JamAI(project_id=project_id, token=api_key)
        self.action_table_id ="TripPlanner"
    
    def generate_itinerary(
        self,
        start_time: str,
        dietary: str,
        transport: str,
        accessibility: str,
        stream: bool = False
    ) -> Dict[str, Any]:
        """
        Call TripPlanner Action Table to generate day itinerary.
        
        Args:
            start_time: "09:00" format
            dietary: "Halal only" or "No preference"
            transport: "Public transport" / "Taxi/Grab" / "Own vehicle"
            accessibility: "Wheelchair-friendly" or "No preference"
            stream: Whether to stream output (for live UI updates)
        
        Returns:
            {
                "itinerary": [...],
                "summary": "...",
                "transport_notes": "...",
                "reasoning_chain": {...}
            }
        """
        if not self.client:
            raise RuntimeError("JamAI client not initialized. Check your API keys.")
        
        # ============================================
        # CORRECT REQUEST FORMAT
        # - Use t.MultiRowAddRequest (not RowAddRequest)
        # - data is a LIST of dicts, even for single row
        # ============================================
        request = t.MultiRowAddRequest(
            table_id=self.action_table_id,
            data=[{  # Note: data is a LIST
                "start_time": start_time,
                "dietary": dietary,
                "transport": transport,
                "accessibility": accessibility
            }],
            stream=stream
        )
        
        # ============================================
        # CORRECT API CALL
        # - Use t.TableType.ACTION (uppercase!)
        # - Pass request object directly
        # ============================================
        response = self.client.table.add_table_rows(
            t.TableType.ACTION,  # UPPERCASE - this is critical!
            request
        )
        
        # ============================================
        # DEFENSIVE RESPONSE EXTRACTION
        # - Use getattr() with fallbacks
        # - Handle missing rows/columns gracefully
        # ============================================
        row0 = response.rows[0] if getattr(response, "rows", None) else None
        if not row0:
            raise ValueError("No response from TripPlanner Action Table")
        
        cols = getattr(row0, "columns", {}) if row0 else {}
        
        # Extract all 6 step outputs
        step1_parse = _safe_text(cols.get("step1_parse"))
        step2_breakfast = _safe_text(cols.get("step2_breakfast"))
        step3_morning = _safe_text(cols.get("step3_morning"))
        step4_lunch = _safe_text(cols.get("step4_lunch"))
        step5_afternoon = _safe_text(cols.get("step5_afternoon"))
        step6_dinner = _safe_text(cols.get("step6_dinner"))
        step7_validate = _safe_text(cols.get("step7_validate"))
        step8_final = _safe_text(cols.get("step8_final"))
        
        # Parse final JSON output
        try:
            itinerary_json = json.loads(step8_final)
        except json.JSONDecodeError:
            # Fallback if LLM didn't produce valid JSON
            itinerary_json = {
                "itinerary": [],
                "summary": "Error parsing itinerary JSON",
                "transport_notes": ""
            }
        
        return {
            "itinerary": itinerary_json.get("itinerary", []),
            "summary": itinerary_json.get("summary", ""),
            "transport_notes": itinerary_json.get("transport_notes", ""),
            "reasoning_chain": {
                "step1_parse": step1_parse,
                "step2_breakfast": step2_breakfast,
                "step3_morning": step3_morning,
                "step4_lunch": step4_lunch,
                "step5_afternoon": step5_afternoon,
                "step6_dinner": step6_dinner,
                "step7_validate": step7_validate,
                "step8_final": step8_final
            }
        }
    
    def generate_itinerary_streaming(
        self,
        start_time: str,
        dietary: str,
        transport: str,
        accessibility: str,
        on_chunk: callable = None
    ) -> Dict[str, Any]:
        """
        Generate itinerary with streaming for live UI updates.
        
        Args:
            on_chunk: Callback function(column_name: str, text: str) called for each token
        
        Returns:
            Same structure as generate_itinerary()
        """
        if not self.client:
            raise RuntimeError("JamAI client not initialized.")
        
        request = t.MultiRowAddRequest(
            table_id=self.action_table_id,
            data=[{
                "start_time": start_time,
                "dietary": dietary,
                "transport": transport,
                "accessibility": accessibility
            }],
            stream=True  # Enable streaming
        )
        
        # Accumulate streamed text per column
        accumulated = {
            "step1_parse": "",
            "step2_breakfast": "",
            "step3_morning": "",
            "step4_lunch": "",
            "step5_afternoon": "",
            "step6_dinner": "",
            "step7_validate": "",
            "step8_final": ""
        }
        
        # Stream response
        for chunk in self.client.table.add_table_rows(t.TableType.ACTION, request):
            col_name = getattr(chunk, "output_column_name", None)
            text = getattr(chunk, "text", "")
            
            if col_name and col_name in accumulated and text:
                accumulated[col_name] += text
                if on_chunk:
                    on_chunk(col_name, text)
        
        # Parse final JSON
        try:
            itinerary_json = json.loads(accumulated["step8_final"])
        except json.JSONDecodeError:
            print("[jamai_client] Warning: failed to parse final JSON from streaming; final_key=", accumulated["step8_final"])
            itinerary_json = {"itinerary": [], "summary": "Error parsing itinerary", "transport_notes": ""}

        # Convert accumulated (defaultdict) to a plain dict for return
        reasoning_chain = dict(accumulated)

        return {
            "itinerary": itinerary_json.get("itinerary", []),
            # "summary": itinerary_json.get("summary", ""),
            "transport_notes": itinerary_json.get("transport_notes", ""),
            "reasoning_chain": reasoning_chain  # instead of accumulated
        }
           


# ============================================
# Singleton instance for import
# ============================================
jamai_client = JamAIClient()


# ============================================
# TESTING
# ============================================
if __name__ == "__main__":
    print("🧪 Testing JamAI Client...")
    
    try:
        client = JamAIClient()
        print("✅ Client initialized")
        
        result = client.generate_itinerary(
            start_time="09:00",
            dietary="Halal only",
            transport="Own vehicle",
            accessibility="Wheelchair-friendly"
        )
        
        print(f"\n✅ Itinerary generated!")
        print(f"Summary: {result['summary']}")
        print(f"Activities: {len(result['itinerary'])}")
        
        for i, act in enumerate(result['itinerary'], 1):
            print(f"  {i}. {act['time']} - {act['place']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")