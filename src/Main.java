import org.json.JSONArray;
import org.json.JSONObject;
import javax.swing.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import java.util.Properties;
import java.io.File;
import java.io.FileReader;
import java.util.List;



public class Main {

    // private JTextField termsOfPaymentField;
    // private JButton skickaFakturorButton;
    // String hej = termsOfPaymentField.getText();

    public static void main(String[] args)
    {
        List<String[]> invoiceIds = new ArrayList<String[]>(collectInvoices());

        System.out.print(invoiceIds.size());

        for (int i = 0; i < invoiceIds.size(); i++)
        {
           System.out.print(invoiceIds.get(i)[0] + "   " + invoiceIds.get(i)[1] + '\n');
        }

    }


    public static List<String[]> collectInvoices()
    {
            List<String[]> invoiceIds = new ArrayList<String[]>();
            Integer pageNr = 1;
            String termsOfPayment = "20";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
            String fromDate = "2018-09-01";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
            String toDate = "2018-09-30";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
            String[] tempArray = new String[2];

            JSONObject custObj;
            JSONObject custResults;

            JSONObject invObj = new JSONObject(fetchInvoiceApiData(pageNr.toString()).toString());
            JSONArray invResults = invObj.getJSONArray("Invoices");


            int amountOfPages = Integer.parseInt(invObj.getJSONObject("MetaInformation").get("@TotalPages").toString());

            for (int i = 0; i < invResults.length(); i++)
            {
                if (invResults.getJSONObject(i).getBoolean("NoxFinans") != false)
                {
                    if (invResults.getJSONObject(i).getDouble("Balance") != 0)
                    {
                        if (invResults.getJSONObject(i).getString("TermsOfPayment").equals(termsOfPayment))
                        {
                            custObj = new JSONObject(fetchCustomerApiData(invResults.getJSONObject(i).getString("CustomerNumber")).toString());
                            custResults = custObj.getJSONObject("Customer").getJSONObject("DefaultDeliveryTypes");

                            tempArray = new String[]{invResults.getJSONObject(i).getString("DocumentNumber"), custResults.get("Invoice").toString()};
                            invoiceIds.add(tempArray); //fler kontroller innan detta görs? stäm av med dokument och malin
                            System.out.print("hej");
//hejsan

                        }
                        else
                        {
                            //printa ut i frontend att betalningsvillkoret inte stämmer med valt - eller det behövs inte ens skrivas kanske?
                        }
                    }
                    else
                    {
                        //printa ut i frontend att balansen är 0 - eller det behövs inte ens skrivas kanske?
                    }
                }
                else
                {
                    //printa ut i frontend att den redan är flaggad som skickad till Fortnox Finans  - eller det behövs inte ens skrivas kanske?
                }
            }

            pageNr++;

            while(amountOfPages >= pageNr)
            {
                invObj = new JSONObject(fetchInvoiceApiData(pageNr.toString()).toString());
                invResults = invObj.getJSONArray("Invoices");

                for (int i = 0; i < invResults.length(); i++)
                {
                    if (invResults.getJSONObject(i).getBoolean("NoxFinans") != true)
                    {
                        if (invResults.getJSONObject(i).getDouble("Balance") != 0)
                        {
                            if (invResults.getJSONObject(i).getString("TermsOfPayment").equals(termsOfPayment))
                            {
                                tempArray = new String[]{invResults.getJSONObject(i).getString("DocumentNumber"), invResults.getJSONObject(i).getString("CustomerNumber")};
                                invoiceIds.add(tempArray); //fler kontroller innan detta görs? stäm av med dokument och malin
                            }
                            else
                            {
                                //printa ut i frontend att betalningsvillkoret inte stämmer med valt - eller det behövs inte ens skrivas kanske?
                            }
                        }
                        else
                        {
                            //printa ut i frontend att balansen är 0 - eller det behövs inte ens skrivas kanske?
                        }
                    }
                    else
                    {
                        //printa ut i frontend att den redan är flaggad som skickad till Fortnox Finans  - eller det behövs inte ens skrivas kanske?
                    }
                    pageNr++;
                }
            }

            return invoiceIds;
    }




    public static StringBuffer fetchInvoiceApiData(String pageNr)
    {
        Properties props = new Properties();
        File configFile = new File("config.properties");
        String fromDate = "2018-09-01";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        String toDate = "2018-09-30";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        String termsOfPayment = "30";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        StringBuffer response = new StringBuffer();
        try {
            FileReader reader = new FileReader(configFile);
            props.load(reader);
            String inputLine = null;
            HttpURLConnection con;
            URL url = new URL("https://api.fortnox.se/3/invoices/?limit=500&fromdate=" + fromDate + "&todate=" + toDate + "&filter=unpaid" +"&page=" + pageNr);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Client-Secret", props.getProperty("f3-clientsecret"));
            con.setRequestProperty("Access-Token", props.getProperty("f3-accesstoken"));
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            con = (HttpURLConnection) url.openConnection();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            con.disconnect();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }




    public static StringBuffer fetchCustomerApiData(String customerNr)
    {
        Properties props = new Properties();
        File configFile = new File("config.properties");
        StringBuffer response = new StringBuffer();
        try {
            FileReader reader = new FileReader(configFile);
            props.load(reader);
            String inputLine = null;
            HttpURLConnection con;
            URL url = new URL("https://api.fortnox.se/3/customers/" + customerNr);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Client-Secret", props.getProperty("f3-clientsecret"));
            con.setRequestProperty("Access-Token", props.getProperty("f3-accesstoken"));
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            con = (HttpURLConnection) url.openConnection();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            con.disconnect();

        } catch (IOException e) {
            e.printStackTrace();
        }
        return response;
    }





/*

    public static void sendInvoices(List<String> invoiceIds)   // KONTROLLERA PRESPONS VID POSTNUMMER OSV OM DET GER ERRORCODE - AGERA PÅ POSTNUMMER
    {
        Properties props = new Properties();
        File configFile = new File("config.properties");
        String fromDate = "2018-09-01";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        String toDate = "2018-09-30";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        String termsOfPayment = "30";  // h�mtas fr�n frontend (skicka i fr�n Javascript?)
        StringBuffer response = new StringBuffer();
        try {
            FileReader reader = new FileReader(configFile);
            props.load(reader);
            String inputLine = null;
            HttpURLConnection con;
            URL url = new URL("https://api.fortnox.se/3/invoices/?limit=500&fromdate=" + fromDate + "&todate=" + toDate + "&filter=unpaid" +"&page=" + pageNr);
            con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Accept", "application/json");
            con.setRequestProperty("Client-Secret", props.getProperty("f3-clientsecret"));
            con.setRequestProperty("Access-Token", props.getProperty("f3-accesstoken"));
            BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            con = (HttpURLConnection) url.openConnection();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            con.disconnect();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }

*/

}

