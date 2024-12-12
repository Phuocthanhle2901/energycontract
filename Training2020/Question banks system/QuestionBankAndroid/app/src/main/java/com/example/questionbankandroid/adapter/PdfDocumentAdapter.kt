package com.example.questionbankandroid.adapter

import android.content.Context
import android.os.Bundle
import android.os.CancellationSignal
import android.os.ParcelFileDescriptor
import android.print.PageRange
import android.print.PrintAttributes
import android.print.PrintDocumentAdapter
import android.print.PrintDocumentInfo
import android.util.Log
import java.io.*

class PdfDocumentAdapter(val context: Context, val path:String):PrintDocumentAdapter(){
    override fun onLayout(
        oldAttributes: PrintAttributes?,
        newAttributes: PrintAttributes?,
        cancellationSignal: CancellationSignal?,
        callback: LayoutResultCallback?,
        extras: Bundle?
    ) {
        if(cancellationSignal!!.isCanceled){
            callback!!.onLayoutCancelled()
        }else{
            val builder = PrintDocumentInfo.Builder("file name")
            builder.setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT)
                .setPageCount(PrintDocumentInfo.PAGE_COUNT_UNKNOWN)
                .build()
            callback!!.onLayoutFinished(builder.build(),newAttributes!=oldAttributes)
        }
    }

    override fun onWrite(
        pages: Array<out PageRange>?,
        destination: ParcelFileDescriptor?,
        cancellationSignal: CancellationSignal?,
        callback: WriteResultCallback?
    ) {
        var inputStream:InputStream?=null
        var out:OutputStream?=null
        try {
            val file = File(path)
            inputStream = FileInputStream(file)
            out = FileOutputStream(destination!!.fileDescriptor)

            if(!cancellationSignal!!.isCanceled){
                inputStream.copyTo(out)
                callback!!.onWriteFinished(arrayOf(PageRange.ALL_PAGES))
            }else{
                callback!!.onWriteCancelled()
            }
        }catch (e:Exception){
            Log.d("CKNWritePDF",e.message!!)
            callback!!.onWriteFailed(e.message)
        }finally {
            try {
                inputStream!!.close()
                out!!.close()
            }catch (e:Exception){
                Log.d("CKNWritePDF",e.message!!)
            }
        }
    }

}
