#!/usr/bin/env Rscript

library(dplyr)
library(tidyr)

sample_data <- read.csv('./data/dbsample.csv')


#################################################################
# CREATE COUNT STATS
#################################################################

# Summarize by state
months_by_state <- sample_data %>% group_by(year,month,skey) %>% summarize(count=n())

# Get the empty counts
for (i in 1:12) {
  for (j in 1993:2013) {
    for (s in unique(months_by_state$skey)) {
      if (nrow(months_by_state[months_by_state$year == j & months_by_state$month == i & months_by_state$skey == s,]) == 0) {
        months_by_state = rbind(months_by_state, data.frame(month=i,year=j,skey=s,count=0))
      }
    }
  }
}

# Summarize by nation
months_by_nation <- months_by_state %>% ungroup() %>% group_by(year, month) %>% summarize(count=sum(count))
months_by_nation$skey <- 'nation'

# Output counts
months <- rbind(months_by_nation, months_by_state)
names(months) <- c('year', 'month', 'count', 'key')
library(jsonlite)
sink('./data/counts.json')
toJSON(months)
sink()

#################################################################
# CREATE VECTOR SOURCE
#################################################################

library(dplyr)
library(tidyr)

# Create the time keys as yyyy-month
sample_data$meas_time <- paste(sample_data$year, sample_data$month, sep="-")
sample_data$year <- NULL
sample_data$month <- NULL

# Summarize any non-unique rows
sample_data <- sample_data %>% group_by(villagecode, meas_time, skey, dkey, lat, lon) %>% summarize(vis_median=mean(vis_median))

# Spread the time and median into a wide dataset
sample_data <- sample_data %>% spread(meas_time, vis_median)

# Make NA numeric by replacing with -1
sample_data[is.na(sample_data)] <- -1

# Create 'csvt' type hints for ogr2ogr
csvt <- "\"String\",\"String\",\"String\",\"Real\",\"Real\""
for (col in colnames(sample_data)[-1:-5]) {
  csvt<-paste(csvt,"\"Real\"",sep=",")
}
write(csvt, './data/sample.csvt')

# Write sample.csv
write.csv(sample_data, './data/sample.csv',row.names=F)
