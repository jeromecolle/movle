SELECT title_basics.tconst, title_basics.primaryTitle, title_basics.startYear, title_basics.runtimeMinutes, title_basics.genres, ratings.averageRating
FROM title_basics
INNER JOIN ratings on title_basics.tconst = ratings.tconst
WHERE ratings.numVotes > 60000
ORDER BY ratings.averageRating DESC