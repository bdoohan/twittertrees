##Load package
##Define parameters

install.packages("ggmap")
library(ggmap)
lat = 40.7059
long = -74.1285
myLocation <- c(long = -74.1285, lat = 40.7059)

##Generate map
?get_map
myMap <- get_map(location=myLocation, source="google", zoom=16, maptype="satellite", crop=FALSE)
ggmap(myMap)
library(ggplot2)
ggmap(myMap)+
  geom_point(aes(x = -74.1285, y = 40.7059), alpha = .8, color="pink", size = 10)

##Add text
tweet = "Tweet Text here"
ggmap(myMap)+
  geom_point(aes(x = -74.1285, y = 40.7059), alpha = .8, color="pink", size = 10)+
  annotate("text", x = -74.1285, y = 40.7059, label = tweet, color="yellow") 
+
  scale_x_continuous(limits = c(-74.1285, -74)) +
  scale_y_continuous(limits = c(40.5059, 40.7059))


