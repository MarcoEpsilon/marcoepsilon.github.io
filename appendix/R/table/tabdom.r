ct <- read.table("ct.txt", header=T)
ct <- table(ct)
# 获取"向量"积的集合
combineVec <- function(m, v)
{
	if (!is.vector(v))
	{
		return(NA)
	}

	if (is.null(m))
	{
		return(v)
	}
	nCol <- ifelse(is.vector(m), length(m), ncol(m))
	print(nCol)
	nFrame <- NULL
	for (i in 1:nCol)
	{
		for (j in 1:length(v))
		{
			nFrame <- cbind(nFrame, c(ifelse(is.vector(m), m[i], m[, i]), v[j]))
		}
	}
	return(nFrame)
}

tabdom <- function(tab)
{
	if ("Freq" %in% dimnames(tab))
	{
		# 简单处理 如果有"Freq"列冲突直接返回
		return(NA)
	}
		
	# 将tab转为data.frame	
	levels <- dimnames(tab)
	frame <- levels[[1]]
	for (i in 2:length(levels))
	{
		frame <- combineVec(frame, levels[[i]])
	}
	# 转置:使得行向量为水平元组
	frame <- t(frame)
	colnames(frame) <- names(levels)
	frame <- data.frame(frame)
	freqs <- NULL
	
	# 构造频数向量
	for (i in 1:nrow(frame))
	{
		
		doArgs <- list(tab)
		for (j in 1:ncol(frame))
		{
			doArgs[[j+1]] <- as.character(frame[i, j])
		}
		freqs <- c(freqs, do.call("[", doArgs))
	}
	frame$Freq <- freqs
	frame <- frame[order(freqs, decreasing=T), ]	
	return(frame)
}

print(tabdom(ct))
