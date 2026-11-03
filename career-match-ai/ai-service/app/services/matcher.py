from typing import List, Dict


# Skill synonyms/aliases for better matching
SKILL_ALIASES = {
    "js": "javascript",
    "ts": "typescript",
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",
    "node.js": "node.js",
    "nodejs": "node.js",
    "express.js": "express.js",
    "expressjs": "express.js",
    "mongo": "mongodb",
    "mongo db": "mongodb",
    "ml": "machine learning",
    "ai": "artificial intelligence",
    "dl": "deep learning",
    "py": "python",
    "rest": "rest apis",
    "rest api": "rest apis",
    "restful api": "rest apis",
    "sql server": "sql",
    "mysql": "sql",
    "postgresql": "sql",
    "postgres": "sql",
    "css3": "css",
    "html5": "html",
}


class SkillMatcher:
    """
    Skill-based matching algorithm.
    
    Algorithm:
    1. Normalize all skills (lowercase, strip whitespace)
    2. Apply synonym/alias resolution
    3. Calculate exact matches
    4. Calculate partial matches (one skill contains the other)
    5. Score = (weighted_matches / total_required_skills) * 100
    
    This is a transparent, explainable algorithm.
    NLP/semantic similarity (e.g., sentence-transformers) can be
    plugged in by overriding the `_similarity_score` method.
    """

    def normalize(self, skill: str) -> str:
        """Normalize a skill string"""
        normalized = skill.lower().strip()
        return SKILL_ALIASES.get(normalized, normalized)

    def _skills_match(self, student_skill: str, required_skill: str) -> float:
        """
        Returns a match score between 0.0 and 1.0 for two skills.
        
        Currently rule-based. Replace this method with NLP similarity
        (e.g., cosine similarity of sentence embeddings) for semantic matching.
        """
        s1 = self.normalize(student_skill)
        s2 = self.normalize(required_skill)

        if s1 == s2:
            return 1.0

        # Partial match: one contains the other
        if s1 in s2 or s2 in s1:
            return 0.8

        return 0.0

    def match(
        self,
        student_skills: List[str],
        required_skills: List[str],
        preferred_skills: List[str] = []
    ) -> Dict:
        if not required_skills:
            return {
                "matchScore": 100,
                "matchedSkills": [],
                "missingSkills": [],
                "recommendations": [],
                "explanation": "No required skills specified."
            }

        matched = []
        missing = []

        for req_skill in required_skills:
            best_score = 0.0
            for stu_skill in student_skills:
                score = self._skills_match(stu_skill, req_skill)
                if score > best_score:
                    best_score = score

            if best_score >= 0.8:
                matched.append(req_skill)
            else:
                missing.append(req_skill)

        # Base score: matched required skills
        base_score = (len(matched) / len(required_skills)) * 100 if required_skills else 0

        # Bonus for preferred skills (up to 10% bonus)
        preferred_matched = 0
        if preferred_skills:
            for pref_skill in preferred_skills:
                for stu_skill in student_skills:
                    if self._skills_match(stu_skill, pref_skill) >= 0.8:
                        preferred_matched += 1
                        break
            bonus = (preferred_matched / len(preferred_skills)) * 10
            final_score = min(100, round(base_score + bonus))
        else:
            final_score = round(base_score)

        # Generate recommendations
        recommendations = []
        for skill in missing[:3]:
            recommendations.append(f"Learn {skill} to improve your match score")
        if preferred_skills and preferred_matched < len(preferred_skills):
            unmatched_pref = [p for p in preferred_skills
                              if not any(self._skills_match(s, p) >= 0.8 for s in student_skills)]
            if unmatched_pref:
                recommendations.append(f"Bonus: Also learn {unmatched_pref[0]} to stand out")

        explanation = (
            f"You match {len(matched)} out of {len(required_skills)} required skills "
            f"({final_score}% match). "
        )
        if missing:
            explanation += f"Missing: {', '.join(missing[:3])}."
        else:
            explanation += "Excellent! You match all required skills."

        return {
            "matchScore": final_score,
            "matchedSkills": matched,
            "missingSkills": missing,
            "recommendations": recommendations,
            "explanation": explanation
        }
