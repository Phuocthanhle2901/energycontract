package com.example.questionbankandroid.admin.home

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import android.print.PrintAttributes
import android.print.PrintManager
import android.provider.Settings
import android.util.Log
import android.view.*
import android.widget.AdapterView
import android.widget.ArrayAdapter
import androidx.fragment.app.Fragment
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.questionbankandroid.R
import com.example.questionbankandroid.adapter.AdminCustomQuestion
import com.example.questionbankandroid.adapter.PdfDocumentAdapter
import com.example.questionbankandroid.util.ImageFilePath
import com.example.questionbankandroid.data.QuestionModel
import com.example.questionbankandroid.databinding.AdminHomeFragmentBinding
import com.example.questionbankandroid.service.Retrofit
import com.example.questionbankandroid.util.Common
import com.itextpdf.text.*
import com.itextpdf.text.pdf.PdfWriter
import com.itextpdf.text.pdf.draw.LineSeparator
import com.karumi.dexter.Dexter
import com.karumi.dexter.PermissionToken
import com.karumi.dexter.listener.PermissionDeniedResponse
import com.karumi.dexter.listener.PermissionGrantedResponse
import com.karumi.dexter.listener.PermissionRequest
import com.karumi.dexter.listener.single.PermissionListener
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.io.BufferedReader
import java.io.File
import java.io.FileOutputStream
import java.io.FileReader
import java.text.Normalizer
import java.util.regex.Pattern
import kotlin.jvm.Throws

class AdminHomeFragment : Fragment() {
    private lateinit var viewModel: AdminHomeViewModel
    private lateinit var binding: AdminHomeFragmentBinding
    private var internetConnect: Boolean = false
    private var path: String? = ""
    private var listPdf: List<QuestionModel> = listOf()
    private var theme="All"

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = AdminHomeFragmentBinding.inflate(inflater, container, false)
        (activity as AppCompatActivity).supportActionBar?.show()
        setHasOptionsMenu(true)

        val viewModelFactory = AdminHomeViewModelFactory(requireActivity().application)
        viewModel = ViewModelProvider(this, viewModelFactory)[AdminHomeViewModel::class.java]

        binding.recycleViewHome.setHasFixedSize(true)
        viewModel.statusInternet.observeForever {
            requestPermission(viewModel.checkPermisstion())
            internetConnect = it
            Log.d("CKNIntenetHome", it.toString())
            if (it) {
                binding.recycleViewHome.visibility = View.VISIBLE
                binding.rl.visibility = View.GONE
            } else {
                //ko co internet
                Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT).show()
                binding.recycleViewHome.visibility = View.GONE
                binding.rl.visibility = View.VISIBLE
            }
        }

        viewModel.listQuestion.observeForever {
            it?.let {
                listPdf = it
                binding.recycleViewHome.adapter = AdminCustomQuestion(it, viewModel)
            }
        }
        val array = ArrayList<String>()
        array.add("All")
        viewModel.listTheme.observeForever {
            it?.let {
                it.forEach { array.add(it.name) }
                val adapter = ArrayAdapter<String>(
                    requireContext(),
                    android.R.layout.simple_spinner_item,
                    array
                )
                adapter.setDropDownViewResource(android.R.layout.simple_list_item_single_choice)
                binding.spinner.adapter = adapter
            }
        }
        binding.spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(
                parent: AdapterView<*>?,
                view: View?,
                position: Int,
                id: Long
            ) {
                if (position > 0) {
                    theme = array[position]
                    viewModel.getThemeQuestion(theme)
                } else {
                    theme = "All"
                    viewModel.getThemeAll()
                }
            }

            override fun onNothingSelected(parent: AdapterView<*>?) {
            }
        }

        return binding.root
    }

    override fun onCreateOptionsMenu(menu: Menu, inflater: MenuInflater) {
        super.onCreateOptionsMenu(menu, inflater)
        inflater.inflate(R.menu.home_admin_menu, menu)

        val search = menu.findItem(R.id.seach).actionView as SearchView
        search.setIconifiedByDefault(true)
        search.queryHint = "Search..."

        //search listener
        search.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                //Khi nhan search tu keyboard
                if (internetConnect) {
                    viewModel.listQuestion.observeForever {
                        it?.let { list ->
                            val a = mutableListOf<QuestionModel>()
                            list.forEach {
                                if (it.question.toLowerCase()
                                        .contains(query!!.toLowerCase().vNToE())
                                ) {
                                    a.add(it)
                                }
                            }
                            binding.recycleViewHome.adapter = AdminCustomQuestion(a, viewModel)
                        }
                    }
                } else {
                    //ko co internet
                    Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT)
                        .show()
                }

                return false
            }

            @SuppressLint("DefaultLocale")
            override fun onQueryTextChange(newText: String?): Boolean {
                if (internetConnect) {
                    viewModel.listQuestion.observeForever {
                        it?.let { list ->
                            val a = mutableListOf<QuestionModel>()
                            list.forEach {
                                if (it.question.toLowerCase()
                                        .contains(newText!!.toLowerCase().vNToE())
                                ) {
                                    a.add(it)
                                }
                            }
                            binding.recycleViewHome.adapter = AdminCustomQuestion(a, viewModel)
                        }
                    }
                } else {
                    //ko co internet
                    Toast.makeText(requireContext(), "No access Internet!", Toast.LENGTH_SHORT)
                        .show()
                }
                return false
            }
        })
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            R.id.Import -> importQuestion()
            R.id.Export -> exportQuestion()
        }
        return super.onOptionsItemSelected(item)
    }

    private fun String.vNToE(): String {
        val temp = Normalizer.normalize(this, Normalizer.Form.NFD)
        val pattern = Pattern.compile("\\p{InCOMBINING_DIACRITICAL_MARKS}+")
        return pattern.matcher(temp).replaceAll("")
    }

    private fun requestPermission(permissionGranted: Boolean) {
        if (!permissionGranted) {
            ActivityCompat.requestPermissions(
                requireActivity(),
                arrayOf(
                    Manifest.permission.INTERNET,
                    Manifest.permission.ACCESS_WIFI_STATE,
                    Manifest.permission.ACCESS_NETWORK_STATE
                ),
                2727
            )
        }
    }

    override fun onResume() {
        super.onResume()
        try {
            viewModel.registerConnectivity()
            viewModel.checkConnections()
        } catch (ex: Exception) {

        }
    }

    override fun onPause() {
        super.onPause()
        try {
            viewModel.unRegisterConnectivity()
        } catch (ex: Exception) {
            showPermissionSettings()
        }
    }

    private fun showPermissionSettings() {
        Toast.makeText(requireContext(), "Internet Permission disable!", Toast.LENGTH_SHORT).show()
        val intent = Intent(
            Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
            Uri.fromParts("package", requireContext().packageName, null)
        )
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        startActivity(intent)
    }

    private fun importQuestion() {
        val hasPermission = (
                ContextCompat.checkSelfPermission(
                    requireContext(),
                    Manifest.permission.READ_EXTERNAL_STORAGE
                )
                        == PackageManager.PERMISSION_GRANTED &&
                        ContextCompat.checkSelfPermission(
                            requireContext(),
                            Manifest.permission.WRITE_EXTERNAL_STORAGE
                        )
                        == PackageManager.PERMISSION_GRANTED)
        if (!hasPermission) {
            ActivityCompat.requestPermissions(
                requireActivity(),
                arrayOf(
                    Manifest.permission.READ_EXTERNAL_STORAGE,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ),
                227
            )
        } else {
            showFileChooser()
        }
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        when (requestCode) {
            1 -> {
                if (grantResults.size > 0 && grantResults[0] === PackageManager.PERMISSION_GRANTED && grantResults[1] === PackageManager.PERMISSION_GRANTED) {
                    showFileChooser()
                }
            }
        }
    }

    private fun showFileChooser() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
        intent.type = "text/plain"
        intent.addCategory(Intent.CATEGORY_OPENABLE)
        try {
            startActivityForResult(
                Intent.createChooser(intent, "Select a File to Upload"),
                227
            )
        } catch (e: Exception) {
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 227 && resultCode == Activity.RESULT_OK) {
            val uri = data!!.data
            path = ImageFilePath().getPath(requireContext(), uri!!)
            readFile(path)
        }

    }

    private fun readFile(path: String?) {
        path?.let {
            val file = File(it)
            val builder = StringBuilder()

            val listQuestion = mutableListOf<QuestionModel>()
            try {
                val br = BufferedReader(FileReader(file))
                var line: String
                while (br.readLine().also { line = it } != null) {
                    builder.append(line)
                }
                br.close()
            } catch (e: java.lang.Exception) {
                Log.e("main", " error is $e")
            }
            val listData = builder.toString().split("++++")
            listData.forEach {
                val list = it.split("----")
                if (list.size > 7) {
                    val answer = list.subList(1, list.size - 5)
                    val sublist = list.subList(list.size - 5, list.size)
                    val questionModel = QuestionModel(
                        answer = answer,
                        null,
                        sublist[2].toInt(),
                        sublist[3].toInt(),
                        list[0],
                        true,
                        sublist[1],
                        sublist[4].toInt(),
                        sublist[0]
                    )
                    listQuestion.add(questionModel)
                } else {
                    Toast.makeText(requireContext(), "Import File failed!", Toast.LENGTH_SHORT)
                        .show()
                }
            }

            Log.d("CKNQuestion", listQuestion.toString())
            xacNhanImport(listQuestion)
        }
    }

    private fun xacNhanImport(listQuestion: List<QuestionModel>) {
        val dialog = AlertDialog.Builder(requireContext())
            .setTitle("IMPORT QUESTION")
            .setMessage("Do you want to import question?")
            .setNegativeButton("Cancel", { dialog, _ -> dialog.dismiss() })
            .setPositiveButton("Ok", { _, _ ->
                uploadQuestion(listQuestion as MutableList<QuestionModel>)
            })
            .setCancelable(false)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_NEGATIVE)
                .setTextColor(resources.getColor(android.R.color.holo_red_dark, null))
            dialog.getButton(AlertDialog.BUTTON_POSITIVE)
                .setTextColor(resources.getColor(R.color.teal_700, null))

        }
        dialog.show()
    }

    private fun uploadQuestion(listQuestion: MutableList<QuestionModel>) {
        viewModel.listQuestion.observeForever {
            it?.let {
                it.forEach { questionBD ->
                    listQuestion.forEach { questionLS ->
                        if (questionLS.question == questionLS.question) {
                            listQuestion.remove(questionLS)
                        }
                    }
                }
            }
        }
        if (listQuestion.size > 0) {
            CoroutineScope(Dispatchers.IO).launch {
                try {
                    var test = ""
                    listQuestion.forEach {
                        test = Retrofit.getRetrofit().uploadQuestions(it)
                    }
                    if (test == "yes") {
                        requireActivity().runOnUiThread {
                            Toast.makeText(
                                requireContext(),
                                "Import Successfully!",
                                Toast.LENGTH_SHORT
                            )
                                .show()
                        }
                        viewModel.getThemeAll()
                    } else {
                        requireActivity().runOnUiThread {
                            Toast.makeText(requireContext(), "Import Failed!", Toast.LENGTH_SHORT)
                                .show()
                        }
                    }
                } catch (e: Exception) {
                    requireActivity().runOnUiThread {
                        Log.d("CKNErrorUpload", e.message.toString())
                    }
                }
            }
        } else {
            Toast.makeText(requireContext(), "Question is already existed!", Toast.LENGTH_SHORT)
                .show()
        }

    }

    private fun exportQuestion() {
        Dexter.withActivity(requireActivity())
            .withPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            .withListener(object : PermissionListener {
                override fun onPermissionGranted(response: PermissionGrantedResponse?) {
                    createPdf(Common.getAppPath(requireContext()) + file_name)
                }

                override fun onPermissionDenied(response: PermissionDeniedResponse?) {
                }

                override fun onPermissionRationaleShouldBeShown(
                    permission: PermissionRequest?,
                    token: PermissionToken?
                ) {
                }
            })
            .check()
    }

    val file_name = "test_pdf.pdf"

    private fun createPdf(path: String) {
        if (File(path).exists()) {
            File(path).delete()
        }
        try {
            val document = Document()
            //save
            PdfWriter.getInstance(document, FileOutputStream(path))
            //open to write

            document.open()
            document.pageSize = PageSize.A4
            document.addCreationDate()
            document.addAuthor("CKN")
            document.addCreator("Thi")
            val titleStyle = Font(Font.FontFamily.TIMES_ROMAN, 36f, Font.NORMAL, BaseColor.BLACK)
            addNewItem(document, "${theme} Questions", Element.ALIGN_CENTER, titleStyle)

            listPdf.forEach { model ->
                val questionStyle =
                    Font(Font.FontFamily.TIMES_ROMAN, 20f, Font.BOLD, BaseColor.BLACK)
                addNewItem(document, model.question, Element.ALIGN_LEFT, questionStyle)
                model.answer.forEachIndexed { i ,answer ->
                    val answerStyle =
                        Font(Font.FontFamily.TIMES_ROMAN, 18f, Font.ITALIC, BaseColor.BLACK)
                    addNewItem(document, "  ${i+1}- "+answer, Element.ALIGN_LEFT, answerStyle)
                }
                val answerStyle =
                    Font(Font.FontFamily.TIMES_ROMAN, 16f, Font.BOLDITALIC, BaseColor.RED)
                addNewItem(
                    document,
                    "The correct answer:" + model.answer[model.trueAnswer.toInt()],
                    Element.ALIGN_LEFT,
                    answerStyle
                )

                addLineSeparate(document)
            }
            document.close()

            printPDF()
        } catch (e: Exception) {
            Log.d("CKNPDFCreate", e.message!!)
        }
    }

    private fun printPDF() {
        val printManager = requireContext().getSystemService(Context.PRINT_SERVICE) as PrintManager
        try {
            val printAdapter = PdfDocumentAdapter(
                requireContext(),
                Common.getAppPath(requireContext()) + file_name
            )
            printManager.print("Document", printAdapter, PrintAttributes.Builder().build())
        } catch (e: Exception) {
            Log.d("CKNPDF", e.message!!)
        }
    }

    private fun addLineSeparate(document: Document) {
        val lineSeparator = LineSeparator()
        lineSeparator.lineColor = BaseColor(0, 0, 0, 60)
        addLineSpace(document)
        document.add(Chunk(lineSeparator))
        addLineSpace(document)
    }

    private fun addLineSpace(document: Document) {
        document.add(Paragraph(""))
    }

    @Throws(DocumentException::class)
    private fun addNewItem(document: Document, text: String, alignLeft: Int, questionStyle: Font) {
        val chunk = Chunk(text, questionStyle)
        val p = Paragraph(chunk)
        p.alignment = alignLeft

        document.add(p)
    }
}
