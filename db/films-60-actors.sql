SELECT title_basics.tconst, title_basics.primaryTitle, title_basics.startYear, title_basics.runtimeMinutes, title_basics.genres, ratings.averageRating, group_concat(names.primaryName) as actorList
FROM title_basics
INNER JOIN actors on title_basics.tconst = actors.tconst
INNER JOIN names on actors.nconst = names.nconst
INNER JOIN ratings on title_basics.tconst = ratings.tconst
WHERE ratings.numVotes > 60000
GROUP BY title_basics.primaryTitle
ORDER BY ratings.averageRating DESC