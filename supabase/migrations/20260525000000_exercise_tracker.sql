-- supabase/migrations/20260525000000_exercise_tracker.sql
-- Half Marathon Training Dashboard for /exercise-tracker
--
-- Required env vars:
--   ANTHROPIC_API_KEY        — AI recalibration via /api/recalibrate
--   NEXT_PUBLIC_TRACKER_PIN  — Owner PIN for workout logging (client-side check)

-- ── Tables ────────────────────────────────────────────────────────────────────

create table training_plan (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null,
  week_start_date date not null,
  phase text not null,
  planned_runs jsonb not null,
  planned_lifts jsonb not null,
  target_weekly_miles numeric not null,
  is_recalibrated boolean default false,
  recalibration_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table workout_logs (
  id uuid primary key default gen_random_uuid(),
  log_date date not null,
  week_number integer not null,
  workout_type text not null,
  status text not null,
  miles numeric,
  pace text,
  lift_day text,
  created_at timestamptz default now()
);

create table recalibration_log (
  id uuid primary key default gen_random_uuid(),
  triggered_at timestamptz default now(),
  week_number integer not null,
  summary_input jsonb not null,
  ai_response text not null,
  adjustments_applied jsonb
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index training_plan_week_number_idx on training_plan (week_number);
create index workout_logs_week_number_idx on workout_logs (week_number);
create index workout_logs_log_date_idx on workout_logs (log_date desc);

-- ── RLS ───────────────────────────────────────────────────────────────────────

alter table training_plan enable row level security;
alter table workout_logs enable row level security;
alter table recalibration_log enable row level security;

create policy "public read training_plan" on training_plan for select using (true);
create policy "public read workout_logs" on workout_logs for select using (true);
create policy "public read recalibration_log" on recalibration_log for select using (true);

-- ── Seed: 24-week training plan (Jun 2 – Nov 8, 2026) ────────────────────────

insert into training_plan (week_number, week_start_date, phase, planned_runs, planned_lifts, target_weekly_miles) values

(1, '2026-06-02', 'base',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":4,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":6,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  14),

(2, '2026-06-09', 'base',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":5,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":6,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  15),

(3, '2026-06-16', 'base',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":5,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":7,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  16),

(4, '2026-06-23', 'base',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":4,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":6,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  14),

(5, '2026-06-30', 'base',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":5,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":8,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  17),

(6, '2026-07-07', 'base',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:30-11:30"},{"day":"Thursday","type":"tempo","miles":5,"pace_zone":"9:00-9:45"},{"day":"Saturday","type":"long","miles":8,"pace_zone":"10:30-11:30"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  18),

(7, '2026-07-14', 'build',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":6,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":8,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  19),

(8, '2026-07-21', 'build',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":5,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":8,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  17),

(9, '2026-07-28', 'build',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":6,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":10,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  21),

(10, '2026-08-04', 'build',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":7,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":10,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  22),

(11, '2026-08-11', 'build',
  '[{"day":"Tuesday","type":"easy","miles":6,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":7,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":10,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  23),

(12, '2026-08-18', 'build',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:15-11:15"},{"day":"Thursday","type":"tempo","miles":6,"pace_zone":"8:45-9:30"},{"day":"Saturday","type":"long","miles":9,"pace_zone":"10:15-11:15"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  20),

(13, '2026-08-25', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":6,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":7,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":11,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  24),

(14, '2026-09-01', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":6,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":8,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":11,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  25),

(15, '2026-09-08', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":7,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":8,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":12,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  27),

(16, '2026-09-15', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":7,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":10,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"},{"day":"Friday","workout":"C"}]',
  22),

(17, '2026-09-22', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":7,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":9,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":12,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  28),

(18, '2026-09-29', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":7,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":9,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":13,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  29),

(19, '2026-10-06', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":7,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":10,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":13,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  30),

(20, '2026-10-13', 'peak',
  '[{"day":"Tuesday","type":"easy","miles":6,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"tempo","miles":9,"pace_zone":"8:30-9:15"},{"day":"Saturday","type":"long","miles":11,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  26),

(21, '2026-10-20', 'taper',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"race_pace","miles":7,"pace_zone":"9:00-9:15"},{"day":"Saturday","type":"long","miles":10,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  22),

(22, '2026-10-27', 'taper',
  '[{"day":"Tuesday","type":"easy","miles":4,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"race_pace","miles":5,"pace_zone":"9:00-9:15"},{"day":"Saturday","type":"long","miles":8,"pace_zone":"10:00-11:00"}]',
  '[{"day":"Monday","workout":"A"},{"day":"Wednesday","workout":"B"}]',
  17),

(23, '2026-11-03', 'taper',
  '[{"day":"Tuesday","type":"easy","miles":5,"pace_zone":"10:00-11:00"},{"day":"Thursday","type":"race_pace","miles":8,"pace_zone":"9:00-9:15"}]',
  '[{"day":"Monday","workout":"A"}]',
  13),

(24, '2026-11-08', 'race',
  '[{"day":"Saturday","type":"race_pace","miles":13.1,"pace_zone":"9:00-9:15"}]',
  '[]',
  13);
