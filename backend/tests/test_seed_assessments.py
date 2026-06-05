"""Tests for the assessment catalog seed and the questions API."""
from __future__ import annotations

from app.models.assessment import Assessment, Question, Option
from app.seed_data import ASSESSMENT_CATALOG, get_assessment_count_by_id


def test_catalog_contains_expected_assessments():
    ids = {a["id"] for a in ASSESSMENT_CATALOG}
    assert ids == {
        "big-five",
        "stress-test",
        "anxiety-gad7",
        "social-support",
        "mbi-burnout",
        "life-satisfaction",
        "resilience-cdrisc",
    }


def test_catalog_matches_frontend_question_counts():
    """Cross-check against src/data/ — the backend should keep step
    with the React side. If this fails, somebody edited one without
    the other."""
    counts = get_assessment_count_by_id()
    assert counts["big-five"] == 60  # 12 items × 5 traits
    assert counts["stress-test"] == 33  # 6 + 6 + 5 + 4 + 3 + 3 + 3 + 3
    assert counts["anxiety-gad7"] == 28  # 7 dimensions × 4 items each
    # 4 个 40 题扩展量表 (frontend 同步):
    assert counts["social-support"] == 43  # 10 主 + 30 题库 (3×10) + 3 延伸
    assert counts["mbi-burnout"] == 40  # 15 主 + 22 题库 (7+6+9) + 3 延伸
    assert counts["life-satisfaction"] == 40  # 5 主 + 33 题库 + 2 延伸
    assert counts["resilience-cdrisc"] == 40  # 10 主 + 27 题库 (6+5+6+5+5) + 3 延伸


def test_new_scales_trait_distribution():
    """SSRS / MBI / SWLS / Resilience 题库扩展后, 维度题量与主量表方向一致."""
    # SSRS: 30 题题库应分布在 subjective / objective / utilization 三维度
    ssrs_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "social-support")
    ssrs_traits = [q["trait"] for q in ssrs_spec["questions"]]
    assert ssrs_traits.count("subjective") >= 13  # 4 + 10 - 1 obj stray
    assert ssrs_traits.count("objective") >= 13   # 3 + 10
    assert ssrs_traits.count("utilization") >= 12  # 3 + 10
    assert ssrs_traits.count("extension") == 3

    # MBI: 22 题题库应分布在 exhaustion / cynicism / efficacy
    mbi_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "mbi-burnout")
    mbi_traits = [q["trait"] for q in mbi_spec["questions"]]
    assert mbi_traits.count("exhaustion") == 12  # 5 + 7
    assert mbi_traits.count("cynicism") == 10     # 4 + 6
    assert mbi_traits.count("efficacy") == 15     # 6 + 9
    assert mbi_traits.count("extension") == 3

    # SWLS: 33 题题库应全部为 satisfaction (单维度)
    swls_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "life-satisfaction")
    swls_traits = [q["trait"] for q in swls_spec["questions"]]
    assert swls_traits.count("satisfaction") == 38  # 5 + 33
    assert swls_traits.count("extension") == 2

    # CD-RISC: 27 题题库应分布在 5 个子维度
    res_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "resilience-cdrisc")
    res_traits = [q["trait"] for q in res_spec["questions"]]
    assert res_traits.count("adaptability") == 8   # 2 + 6
    assert res_traits.count("relationships") == 6  # 1 + 5
    assert res_traits.count("meaning") == 8         # 2 + 6
    assert res_traits.count("selfEfficacy") == 7    # 2 + 5
    assert res_traits.count("optimism") == 8        # 3 + 5
    assert res_traits.count("extension") == 3


def test_new_scales_reverse_items_present():
    """题库扩展必须包含反向题 (降低社会赞许性偏差)."""
    # SWLS 题库应至少有 5 道反向题
    swls_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "life-satisfaction")
    swls_reverse = sum(1 for q in swls_spec["questions"] if q["reverse"])
    assert swls_reverse >= 5, f"SWLS only has {swls_reverse} reverse items"

    # CD-RISC 题库应至少有 3 道反向题
    res_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "resilience-cdrisc")
    res_reverse = sum(1 for q in res_spec["questions"] if q["reverse"])
    assert res_reverse >= 3, f"CD-RISC only has {res_reverse} reverse items"

    # MBI 题库应至少有 1 道反向题 (PE 是反向, 题库继续)
    mbi_spec = next(a for a in ASSESSMENT_CATALOG if a["id"] == "mbi-burnout")
    mbi_reverse = sum(1 for q in mbi_spec["questions"] if q["reverse"])
    assert mbi_reverse >= 6, f"MBI only has {mbi_reverse} reverse items (PE原6题)"


def test_big_five_has_all_five_traits_balanced():
    """Each Big-Five trait should be represented, and the reverse-scored
    items should be roughly half (BFI-60 uses 5 or 6 reverse items per
    trait, not a hard 6).  We assert a sane window rather than a fixed
    number so the test doesn't break if a future revision of the
    frontend data shifts the balance by one item."""
    traits = [q["trait"] for q in ASSESSMENT_CATALOG[0]["questions"]]
    assert set(traits) == {"A", "C", "E", "N", "O"}
    for trait in ("O", "C", "E", "A", "N"):
        per_trait = [q for q in ASSESSMENT_CATALOG[0]["questions"] if q["trait"] == trait]
        assert len(per_trait) == 12, f"trait {trait} has {len(per_trait)} questions"
        reverse_count = sum(1 for q in per_trait if q["reverse"])
        # BFI-60 spec: 5 or 6 reverse items per trait, balance around half.
        assert 4 <= reverse_count <= 8, (
            f"trait {trait} has {reverse_count} reverse items; expected 5 or 6"
        )


def test_seed_creates_seven_assessments(db_session):
    """End-to-end through the actual init_db.seed_assessments path."""
    from init_db import seed_assessments

    n = seed_assessments(db_session)
    assert n == 7
    db_session.expire_all()

    rows = db_session.query(Assessment).order_by(Assessment.id).all()
    expected_ids = [
        "anxiety-gad7",
        "big-five",
        "life-satisfaction",
        "mbi-burnout",
        "resilience-cdrisc",
        "social-support",
        "stress-test",
    ]
    assert [r.id for r in rows] == expected_ids
    for row in rows:
        assert row.is_active is True
        assert row.total_questions == len(row.questions)


def test_seed_is_idempotent(db_session):
    from init_db import seed_assessments

    assert seed_assessments(db_session) == 7
    # Re-running must not insert duplicates and must not raise.
    assert seed_assessments(db_session) == 0
    assert db_session.query(Assessment).count() == 7
    # big-five should still have its 60 questions, not 120.
    bf = db_session.query(Assessment).filter_by(id="big-five").one()
    assert len(bf.questions) == 60
    # SSRS 应该有 43 题 (10 主 + 30 题库 + 3 延伸)
    ssrs = db_session.query(Assessment).filter_by(id="social-support").one()
    assert len(ssrs.questions) == 43
    # MBI 应该有 40 题
    mbi = db_session.query(Assessment).filter_by(id="mbi-burnout").one()
    assert len(mbi.questions) == 40


def test_seed_question_carry_trait_and_reverse_flags(db_session):
    from init_db import seed_assessments

    seed_assessments(db_session)
    db_session.expire_all()

    # First Big-Five question (O1) is non-reverse; the seventh (O7) is.
    q1 = db_session.query(Question).filter_by(assessment_id="big-five", sort_order=0).one()
    assert q1.trait == "O"
    assert q1.is_reverse is False

    q7 = db_session.query(Question).filter_by(assessment_id="big-five", sort_order=6).one()
    assert q7.trait == "O"
    assert q7.is_reverse is True

    # GAD-7: first 'worries' question has dimension copied onto options.
    g1 = db_session.query(Question).filter_by(assessment_id="anxiety-gad7", sort_order=0).one()
    assert g1.trait == "worries"
    for opt in g1.options:
        assert opt.dimension == "worries"
    # GAD-7 has 4 options (0-3 frequency scale).
    assert len(g1.options) == 4


def test_seed_options_score_value_matches_label_index(db_session):
    """The Likert 1-5 and 0-4/0-3 scales must round-trip cleanly through
    Postgres, i.e. option.sort_order == position in the seed options list
    and option.score_value is the numeric payload."""
    from init_db import seed_assessments

    seed_assessments(db_session)
    db_session.expire_all()

    bf_first = db_session.query(Question).filter_by(assessment_id="big-five", sort_order=0).one()
    assert [o.score_value for o in bf_first.options] == [1, 2, 3, 4, 5]
    assert [o.sort_order for o in bf_first.options] == [0, 1, 2, 3, 4]

    gad_first = db_session.query(Question).filter_by(assessment_id="anxiety-gad7", sort_order=0).one()
    assert [o.score_value for o in gad_first.options] == [0, 1, 2, 3]


def test_list_assessments_returns_seeded_catalog(db_session, client):
    """The public catalog endpoint should expose the seeded slugs.
    Seed first because the test fixture DB starts empty."""
    from init_db import seed_assessments

    seed_assessments(db_session)

    r = client.get("/api/v1/assessments/")
    assert r.status_code == 200
    ids = {a["id"] for a in r.json()["assessments"]}
    assert ids == {
        "big-five",
        "stress-test",
        "anxiety-gad7",
        "social-support",
        "mbi-burnout",
        "life-satisfaction",
        "resilience-cdrisc",
    }


def test_get_assessment_uses_slug_not_uuid(db_session, client):
    """A bare slug like 'big-five' must resolve. UUID-shaped slugs would
    also work, but the frontend hardcodes the friendly slugs. The
    route requires auth, so we register first."""
    from init_db import seed_assessments

    seed_assessments(db_session)
    client.post(
        "/api/v1/auth/register",
        json={"email": "viewer@x.com", "username": "viewer", "password": "hunter22pass"},
    )
    token = client.post(
        "/api/v1/auth/login",
        data={"username": "viewer@x.com", "password": "hunter22pass"},
    ).json()["access_token"]
    hdr = {"Authorization": f"Bearer {token}"}

    r = client.get("/api/v1/assessments/big-five", headers=hdr)
    assert r.status_code == 200
    body = r.json()
    assert body["id"] == "big-five"
    assert body["total_questions"] == 60


def test_get_questions_returns_trait_and_is_reverse(db_session, client):
    """The questions endpoint must surface the new trait / is_reverse
    fields so a future server-side scorer can stay consistent with
    the client-side scoring modules."""
    from init_db import seed_assessments

    seed_assessments(db_session)
    client.post(
        "/api/v1/auth/register",
        json={"email": "viewer2@x.com", "username": "viewer2", "password": "hunter22pass"},
    )
    token = client.post(
        "/api/v1/auth/login",
        data={"username": "viewer2@x.com", "password": "hunter22pass"},
    ).json()["access_token"]
    hdr = {"Authorization": f"Bearer {token}"}

    r = client.get("/api/v1/assessments/big-five/questions", headers=hdr)
    assert r.status_code == 200
    qs = r.json()
    assert len(qs) == 60
    # Field shape: every question must carry trait + is_reverse + options.
    for q in qs:
        assert "trait" in q
        assert "is_reverse" in q
        assert q["trait"] in {"O", "C", "E", "A", "N"}
        assert isinstance(q["is_reverse"], bool)
        assert q["options"], "every question should have response options"
    # Verify the reverse count matches the catalog definition (sanity
    # check that the seed -> API round-trip didn't lose flags).
    expected_reverse = sum(
        1 for q in ASSESSMENT_CATALOG[0]["questions"] if q["reverse"]
    )
    reverse_qs = [q for q in qs if q["is_reverse"]]
    assert len(reverse_qs) == expected_reverse


def test_unknown_assessment_slug_returns_404(db_session, client):
    from init_db import seed_assessments

    seed_assessments(db_session)
    client.post(
        "/api/v1/auth/register",
        json={"email": "viewer3@x.com", "username": "viewer3", "password": "hunter22pass"},
    )
    token = client.post(
        "/api/v1/auth/login",
        data={"username": "viewer3@x.com", "password": "hunter22pass"},
    ).json()["access_token"]
    hdr = {"Authorization": f"Bearer {token}"}

    r = client.get("/api/v1/assessments/no-such-thing", headers=hdr)
    assert r.status_code == 404
    r = client.get("/api/v1/assessments/no-such-thing/questions", headers=hdr)
    assert r.status_code == 404
