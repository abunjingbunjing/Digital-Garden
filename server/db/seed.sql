-- Developer-only local seed. Credentials: dev / garden123
INSERT INTO gardens (id, username, password_hash, garden_name, started_at, state)
VALUES (
  'developer-garden',
  'dev',
  'ascii-garden-dev:ef3f4f1c9838242844625b2ccc722cc92d84216b5e37ac85e6e6672b01fc76b0a3d53c5edcfbde774982c17b46ac6bca32b5ecfcaee78c22b55f2a55fcecd21a',
  'Developer Garden',
  now() - interval '127 days',
  $$
  {
    "lastWateredAt": null,
    "waterUsed": 0,
    "collection": [],
    "beds": [
      {"id":1,"locked":false,"slots":[
        {"id":1,"plant":{"value":110,"watered":false}},
        {"id":2,"plant":{"value":111,"watered":false}},
        {"id":3,"plant":{"value":112,"watered":false}},
        {"id":4,"plant":{"value":113,"watered":false}},
        {"id":5,"plant":{"value":114,"watered":false}}
      ]},
      {"id":2,"locked":false,"slots":[
        {"id":1,"plant":{"value":115,"watered":false}},
        {"id":2,"plant":{"value":116,"watered":false}},
        {"id":3,"plant":{"value":117,"watered":false}},
        {"id":4,"plant":{"value":118,"watered":false}},
        {"id":5,"plant":{"value":119,"watered":false}}
      ]},
      {"id":3,"locked":false,"slots":[
        {"id":1,"plant":{"value":120,"watered":false}},
        {"id":2,"plant":{"value":121,"watered":false}},
        {"id":3,"plant":{"value":122,"watered":false}},
        {"id":4,"plant":{"value":123,"watered":false}},
        {"id":5,"plant":{"value":124,"watered":false}}
      ]},
      {"id":4,"locked":false,"slots":[
        {"id":1,"plant":{"value":125,"watered":false}},
        {"id":2,"plant":{"value":126,"watered":false}},
        {"id":3,"plant":{"value":127,"watered":false}},
        {"id":4,"plant":{"value":128,"watered":false}},
        {"id":5,"plant":null}
      ]},
      {"id":5,"locked":false,"slots":[
        {"id":1,"plant":null},{"id":2,"plant":null},{"id":3,"plant":null},{"id":4,"plant":null},{"id":5,"plant":null}
      ]}
    ]
  }
  $$::jsonb
)
ON CONFLICT (username) DO UPDATE SET
  id = EXCLUDED.id,
  password_hash = EXCLUDED.password_hash,
  garden_name = EXCLUDED.garden_name,
  started_at = EXCLUDED.started_at,
  state = EXCLUDED.state;
