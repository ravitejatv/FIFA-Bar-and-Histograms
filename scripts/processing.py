import pandas
import numpy as np
col_list = ["short_name", "nationality","club","preferred_foot","team_position","body_type",
"overall","skill_moves","team_jersey_number","pace","shooting","passing","dribbling","defending","physic",
"height_cm","weight_kg","age"]
data = pandas.read_csv("../data/players_15.csv", delimiter=",", usecols=col_list, nrows=500)
data.to_csv('../data/fifa_processed.csv', index=False)