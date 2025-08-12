CREATE TABLE IF NOT EXISTS "children" (
  "id" serial PRIMARY KEY NOT NULL,
  "team_id" integer NOT NULL,
  "name" varchar(100) NOT NULL,
  "parent_id" integer NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
-->
DO $$ BEGIN
 ALTER TABLE "children" ADD CONSTRAINT "children_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
-->
DO $$ BEGIN
 ALTER TABLE "children" ADD CONSTRAINT "children_parent_id_users_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;