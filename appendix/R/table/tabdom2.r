ct <- read.table("ct.txt", header=T)

ct <- table(ct)


tabdom <- function(tab)
{
	frame <- as.data.frame(tab)

	frame <- frame[order(frame$Freq, decreasing=T), ]

	return(frame)
}


print(tabdom(ct))
